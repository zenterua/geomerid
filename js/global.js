/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/
/* 01 - VARIABLES */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

jQuery(function($) {
    "use strict";

    /*================*/
    /* 01 - VARIABLES */
    /*================*/
    var swipers = [], winW, winH, headerH, winScr, footerTop, _isresponsive, contentOverflow, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
    /*========================*/
    /* 02 - page calculations */
    /*========================*/
    _functions.pageCalculations = function(){
        winW = $(window).width();
        winH = $(window).height();
    };

    /*=================================*/
    /* 03 - function on document ready */
    /*=================================*/
    if ( $('.main-content-wrapper').length &&  $(window).width() >= 768 ) {
        $('body').addClass('overflow-hidden');
    }

    var wWid = $(window).width(), clientMaxWidth, clientMinWidth;
    if ( $('.map-info-wrapp' ).length) {
        clientMaxWidth = wWid - $('.map-info-wrapp').width() - 70;  
    } else {
        clientMaxWidth = wWid / 3 * 2;
    }

    if (wWid >= 1500) {
        clientMinWidth = wWid / 4;
    } else if (wWid >= 1200) {
        clientMinWidth = wWid / 3;
    } else if (wWid >= 992) {
        clientMinWidth = wWid / 3 * 1.25;
    } else if (wWid < 992) {
        clientMaxWidth = wWid / 3 * 2.5;
        clientMinWidth = wWid / 3 * 1.50;
    }
    if ($( "#resizable" ).length && !_ismobile) {
        $( "#resizable" ).resizable({
            maxWidth: clientMaxWidth,
            minWidth: clientMinWidth,
            start: function( event, ui ) {
                $(this).removeClass('side-bar-none-transition');
            },
            stop: function( event, ui ) {
                $(this).addClass('side-bar-none-transition');
            }
        });
    }

     var availableTags = [
        {
            value: "Париж",
            desc: "Франция, Центральный регион"
        }, {
            value: "Москва",
            desc: "Россия, Центральный регион"
        }, {
            value: "Киев",
            desc: "Украина, Центральный регион"
        }, {
            value: "Название маршрута по континету №1",
            desc: "Маршрут"
        }, {
            value: "Пешие маршруты по центру Москвы",
            desc: "Маршрут"
        }, {
            value: "Москва река",
            desc: "Тема"
        }, {
            value: "Московский кремль",
            desc: "Россия, Центральный регион, Москва"
        }
    ];

    if ($( "#tags" ).length) {
        $( "#tags" ).autocomplete({
            source: availableTags,
            open: function () { 
                $('ul.ui-autocomplete').addClass('opened');
                if ($('ul.ui-autocomplete').outerHeight() < 260) {
                    $('ul.ui-autocomplete').addClass('hide-scroll');
                } else {
                    $('ul.ui-autocomplete').removeClass('hide-scroll');
                }
            },
            close: function () { 
                $('ul.ui-autocomplete')
                  .removeClass('opened'); 
            },
            create: function( event, ui ) {
                return false;
            },
            response: function(event, ui) {
                if (ui.content.length === 0) {
                    $(this).closest('.input-wrapper').find('.search-info-error').addClass('show-error');
                } else {
                    $(this).closest('.input-wrapper').find('.search-info-error').removeClass('show-error');
                }
            }
        })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $( "<li>" )
            .append( "<div>" + "<p>" + item.label + "</p>" + "<span>" + item.desc + "</span>" + "</div>" )
            .appendTo( ul );
        };
        $( "#tags" ).keyup(function() {
            if ($(this).val()) {
                $(this).closest('.input-wrapper').find('.search-info-example').removeClass('show-example');
            } else {
                $(this).closest('.input-wrapper').find('.search-info-error').removeClass('show-error');
                $(this).closest('.input-wrapper').find('.search-info-example').addClass('show-example');
            }
        });
        $( "#tags" ).focusin(function() {
            $(this).closest('.input-wrapper').find('.search-info-example').addClass('show-example');
        });
        $( "#tags" ).focusout(function() {
            $(this).closest('.input-wrapper').find('.search-info-example').removeClass('show-example');
            $(this).closest('.input-wrapper').find('.search-info-error').removeClass('show-error');
        });
    }
    


    if(_ismobile) $('body').addClass('mobile');
    
    setTimeout(function(){
        $('#loader-wrapper').fadeOut(500);

    }, 500);
    
    setTimeout( function() {
        _functions.initSwiper();
        
    }, 500);
    if ($(".custom-scroll-bar").length) {
        $(".custom-scroll-bar").mCustomScrollbar({
            axis:"y",
            callbacks:{
                whileScrolling:function(){
                    $('.informer-wrapp').removeClass('active');
                }
            }
        });
    }

var contentH;

    _functions.contentHeigh =  function() {
        var shortcodeMasHSum = 0;
        var windowH = $(window).height();
        var shortcodeH, searchWrapperHeight, headerHeight;
        var shortcodeMasH = [];
        var shortcodeI = 0;
        if ($('.shortcode-type9').length) {
            $('.shortcode-type9').each(function(index, el) {
                $(this).addClass('shortcode-' + shortcodeI);
                shortcodeH = $(this).addClass('shortcode-' + shortcodeI).innerHeight();
                shortcodeMasH.push(shortcodeH);
                shortcodeI++;
            });
        }

        searchWrapperHeight = $('.search-wrapper').innerHeight() + 30;

        if ($('header').length && $('.content').length && $(window).width() > 767) {
            headerHeight = $("header").innerHeight();
            if ($('.shortcode-type9').length) {
                for (var i = 0; i < shortcodeMasH.length; i++) {
                    shortcodeMasHSum += shortcodeMasH[i];
                }
                contentH = windowH - headerHeight - shortcodeMasHSum - searchWrapperHeight;
            } else {
                contentH = windowH - headerHeight - searchWrapperHeight;
            } 
            $('.content').css({
                height: contentH
            });
        }
    }


     _functions.contentHeigh();

    /*============================*/
    /* 04 - function on page load */
    /*============================*/
    // $('.swiper-container.swiper-control-top').each(function(){
    //         swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swiper-main-wrapper').find('.swiper-control-bottom').attr('id')];
    //     });

    // var initIterator = 0;
    // _functions.initSwiper = function(){
    //     $('.swiper-container').not('.initialized').each(function(){                 
    //         var $t = $(this);                 
    //         var index = 'swiper-unique-id-' + initIterator;

    //         $t.addClass('swiper-'+index+' initialized').attr('id', index);



    $(window).load(function() {

    });

    /*==============================*/
    /* 05 - function on page resize */
    /*==============================*/
    _functions.resizeCall = function(){
        setTimeout(function() {
            _functions.pageCalculations();

            _functions.initSwiper();
            _functions.initSelect();
            _functions.contentHeigh();
        }, 100);
    };

    _functions.initSelect = function(){
        if(!$('.SelectBox').length) return false;
        $('.SelectBox').not('.initialized').each(function(){
            $(this).addClass('initialized').SumoSelect();  
        });
    };

    setTimeout( function() {
        _functions.initSelect();
    }, 500);
    
    if(!_ismobile){
        $(window).resize(function(){
            _functions.resizeCall();
        });
    } else{
        window.addEventListener("orientationchange", function() {
            _functions.resizeCall();
        }, false);
    }

    /*==============================*/
    /* 06 - function on page scroll */
    /*==============================*/


    /*=====================*/
    /* 07 - swiper sliders */
    /*=====================*/

    var i = 0;
    var initIterator = 0;
    _functions.initSwiper = function(){
        $('.swiper-container').not('.initialized').each(function(){                 
            var $t = $(this);                 
            var index = 'swiper-unique-id-' + initIterator;

            $t.addClass('swiper-'+index+' initialized').attr('id', index);
            $t.parent().find('.swiper-pagination').addClass('swiper-pagination-'+index);
            $t.parent().find('.swiper-button-prev').addClass('swiper-button-prev-'+index);
            $t.parent().find('.swiper-button-next').addClass('swiper-button-next-'+index);

            var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
            if(slidesPerViewVar!='auto') slidesPerViewVar = parseFloat(slidesPerViewVar, 10);
            // if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

            swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
                pagination: '.swiper-pagination-'+index,
                paginationClickable: true,
                nextButton: '.swiper-button-next-'+index,
                prevButton: '.swiper-button-prev-'+index,
                slidesPerView: slidesPerViewVar,
                autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
                autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
                touchMoveStopPropagation: 0,
                preventClicksPropagation: 1,
                autoplayDisableOnInteraction: true,
                breakpoints: ($t.is('[data-breakpoints]'))? {
                    767: { 
                      slidesPerView: ($t.is('[data-xs-slides]'))?parseFloat($t.data('xs-slides'), 10):1, 
                    }, 
                    991: { 
                      slidesPerView: ($t.is('[data-sm-slides]'))?parseFloat($t.data('sm-slides'), 10):1, 
                    }, 
                    1199: { 
                      slidesPerView: ($t.is('[data-md-slides]'))?parseFloat($t.data('md-slides'), 10):1, 
                    }, 
                    1500: { 
                      slidesPerView: ($t.is('[data-lg-slides]'))?parseFloat($t.data('lg-slides'), 10):1, 
                    } 
                } : {},
                paginationType: 'bullets',
                initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
                speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
                keyboardControl: true,
                mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
                mousewheelReleaseOnEdges: true,
                direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
                parallax: (_ismobile) ? 0 : ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
                spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
                loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
                centeredSlides:($t.is('[data-centered]'))?parseInt($t.data('centered'),10):0,
                roundLengths:($t.is('[data-round]'))?$t.data('round'):false,
                slideToClickedSlide:($t.is('[data-slide-clickable]'))?parseInt($t.data('slide-clickable'), 10):0,
                effect: $t.is("[data-effect]") ? $t.data("effect") : 0,
                freeMode: $t.is("[data-free-mode]") ? $t.data("free-mode") : 0
            });
            swipers['swiper-'+index].update();
            initIterator++;
        });
        $('.swiper-container.swiper-control-top').each(function(){
            swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swiper-main-wrapper').find('.swiper-control-bottom').attr('id')];
        });
        $('.swiper-container.swiper-control-bottom').each(function(){
            swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swiper-main-wrapper').find('.swiper-control-top').attr('id')];
        });
    };

    /*==============================*/
    /* 08 - buttons, clicks, hovers */
    /*==============================*/

    // Informer
    $(document).on('click', '.informer-button', function(event) {
        // $('.informer-wrapp').removeClass('active');
        $(this).closest('.informer-wrapp').addClass('active');
        $(this).closest('.informer-wrapp').find('.share-wrapp').removeClass('active');
        $(this).closest('.main-content-wrapper').addClass('open-informer');
        $('body').addClass('open-informer');
        if ($(window).width() > 767) {
            var x = $(this).offset();
            $(this).closest('.informer-wrapp').find('.informer').css({
                top: x.top,
                left: x.left
            });
        }
    });

    $(document).on('click', '.informer-close-button', function(event) {
        $(this).closest('.informer-wrapp').removeClass('active');
        $(this).closest('.informer-wrapp').find('.share-wrapp').removeClass('active');
        $(this).closest('.main-content-wrapper').removeClass('open-informer');
        $('body').removeClass('open-informer');
    });
    // Informer


    // Main content
    $('.close-button').on('click', function(event) {
        // $(this).closest('.main-content-wrapper').addClass('side-bar-transition');
        $(this).closest('.main-content-wrapper').toggleClass('hide-content');
    });

    // Main content

    // Open menu
    $('.hamburger').on('click', function(event) {
        $(this).closest('header').toggleClass('active');
    });
    // Open menu

    // Check favorite
    $('.icon').on('click', function(event) {
        $(this).closest('.favorite-wrapp').toggleClass('active');
    });
    // Check favorite

    // Tabs
    $('.item').on('click', function(event) {
        $('.item').removeClass('active');
        $(this).addClass('active');
    });
    // Tabs

    // open video
    $('.video-button').on('click', function(event) {
        $(this).closest('.video-wrapp').addClass('active');
    });
    // open video

    // close video
    $('.close-video').on('click', function(event) {
        $(this).closest('.video-wrapp').removeClass('active');
    });
    // close video

    // Accordion
    $('.accordion-title').on('click', function(event) {
        $(this).closest('.accordion-element').toggleClass('active').find('.accordion-content').slideToggle(400);
    });
    // Accordion

    // Open/close links
    $('.open-links-wrapp').on('click', function(event) {
        $(this).closest('.links-wrapp').toggleClass('active');
    });
    // Open/close links

    // Open share
    $('.open-share').on('click', function(event) {
        $(this).closest('.informer-wrapp').find('.share-wrapp').addClass('active');
    });
    // Open share

    // Map 
    $('.map-toggle-button').on('click', function(event) {
        $(this).closest('.map-wrapper').toggleClass('map-height');
    });
    // Map

    $('.slide-toggle-button').on('click', function(event) {
        $(this).closest('.slide-toggle-block').find('.toggle-wrapper').slideDown(400);
        var newContentH = contentH - 54;
        $('.content').css({
            height: newContentH
        });
        setTimeout(function() {
            $('.slide-toggle-button').addClass('down');
        }, 401);
    }); 

    $(document).on('click', '.slide-toggle-button.down', function(event) {
        console.log(1);
        $(this).closest('.slide-toggle-block').find('.toggle-wrapper').slideUp(400);
        $('.content').css({
            height: contentH
        });
        setTimeout(function() {
            $('.slide-toggle-button').removeClass('down');
        }, 401);
    }); 

    $('.gallery-share-button').on('click', function(event) {
        $(this).closest('.gallery-share-wrapper').toggleClass('active');
    });


});