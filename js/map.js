jQuery(function ($) {
    'use strict';
    var map, markers = [], AllMarkesr = [], snazzyWindow, markersClusters, clusterStyles, previousPopup, centerLatlng, mapOptions, styles, styledMap, geocoder, geoPlaceLatLng, circle, allPlaces;

    function addMarker(lat, lng, type, name, popupContent) {
        var markerImage = {
            url: type === 'country' ? $('#map').attr('data-img-country') : type === 'city' ?  $('#map').attr('data-img-city') : type === 'places' ? $('#map').attr('data-img-place') : $('#map').attr('data-img-simple'),
            scaledSize : new google.maps.Size(60, 68),
        };

        var markerLatLng = new google.maps.LatLng(lat,lng);

        var singleMarker = new google.maps.Marker({
            position: markerLatLng,
            icon: markerImage,
            name: name,
            content: popupContent
        });

        markers.push(singleMarker);
        AllMarkesr.push(singleMarker);

        google.maps.event.addListener(singleMarker, 'click', function(){
            showPreviosMarker();
            showInfowindow(this);
            previousPopup = this;
            this.setMap(null);
        });

        singleMarker.setMap(map);

    }

    function initMap() {
        centerLatlng = new google.maps.LatLng($('#map').attr("data-lat"),$('#map').attr("data-lng"));
        geocoder = new google.maps.Geocoder();
        mapOptions = {
            zoom: parseInt($('#map').attr("data-zoom")),
            center: centerLatlng,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            zoomControl: $(window).width() >= 767 ? true : false,
        };

        styles  = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cfe5ef"},{"visibility":"on"}]}];
        styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});


        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        snazzyWindow = new SnazzyInfoWindow({
            map: map,
            closeOnMapClick: false,
            border: false,
            callbacks: {
                close: function(){
                    showPreviosMarker();
                }
            }
        });

        clusterStyles = [{
                url: $('#map').attr("data-img-cluster"),
                height: 70,
                width: 70,
                textColor: '#000',
                textSize: 14
            }
        ];

        if (window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = {lat: position.coords.latitude, lng: position.coords.longitude};
                geocoder.geocode({'latLng': location}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK && results[0]) {
                        geoPlaceLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    }
                });
            });
        }

        // Ajax. get map marker info
        $.ajax({
            url: 'mapLocations.json',
            type: 'get',
            dataType: 'json',
            error: function (error) {
                console.log(error);
            },
            success: function (response) {
                allPlaces = response;
                response.forEach(function(country) {
                    if ( country.city ) {
                        country.city.forEach(function(city) {
                            addMarker(city.coordinates.lat, city.coordinates.lng, city.type, city.name, city.popupContent);

                            if ( city.places ) {
                                city.places.forEach(function(place) {
                                    addMarker(place.coordinates.lat, place.coordinates.lng, place.type, place.name, place.popupContent);
                                });
                            }

                        });
                    }

                });
                markersClusters = new MarkerClusterer(map, markers, {styles: clusterStyles});
            }
        });
    }

    function showInfowindow(marker){
        snazzyWindow.setContent(marker.content);
        snazzyWindow.setPosition(marker.position);
        snazzyWindow.open();
        map.panTo(marker.position);
        console.log(marker);
        marker.visible = false;
         console.log(marker);

        setTimeout(function () {
            $('.shortcode-type10').addClass('show');
        },100);
    }

    function showPreviosMarker() {
    	console.log(previousPopup);
        if ( previousPopup ) {
        	previousPopup.visible = true;
        	previousPopup.setMap(map);
        }
    }

    function closestPlaces(geoPlaceLatLng) {
        map.setCenter(geoPlaceLatLng);
        map.setZoom(13);

        if ( circle ) circle.setMap(null);

         circle = new google.maps.Circle({
            strokeColor: '#F7E8E3',
            strokeOpacity: 1,
            strokeWeight: 10,
            fillColor: '#F4AE4C',
            fillOpacity: .5,
            map: map,
            center: geoPlaceLatLng,
            radius: $('.closestPlaces').data('search-radius') ? +$('.closestPlaces').data('search-radius') : 1000
        });
    }

    function getBounds() {
        var bounds = new google.maps.LatLngBounds();

        markers.forEach(function (marker) {
            bounds.extend(marker.getPosition());
        });

        map.fitBounds(bounds);
    }

    function filtering(filterAjaxUrl, filterCountry, filterType, filterCity, filterCategory ) {
        //clear markers and clusters
        snazzyWindow.close();
        markers.forEach(function (i) {
            i.setMap(null);
        });
        markers = [];
        if ( markersClusters ) markersClusters.clearMarkers();
        if ( circle ) circle.setMap(null);

        if ( filterType.toLowerCase() === 'country' ) {
            allPlaces.forEach(function (country) {
                if ( country.name === filterCountry ) {

                    if ( country.city ) {
                        country.city.forEach(function(city) {
                            addMarker(city.coordinates.lat, city.coordinates.lng, city.type, city.name, city.popupContent);

                            if ( city.places ) {
                                city.places.forEach(function(place) { // Inside city find places and create places marker
                                    addMarker(place.coordinates.lat, place.coordinates.lng, place.type, place.name, place.popupContent);
                                });
                            }

                        });
                    }

                }
            });

            getBounds();
            markersClusters = new MarkerClusterer(map, markers, {styles: clusterStyles});

            $.ajax({
                url: filterAjaxUrl,
                type: 'get',
                dataType: 'html',
                error: function (error) {
                    console.log(error);
                },
                success: function (response) {
                    $('.content-ajax').find('.content').remove();
                    $('.loader-ajax').addClass('show-loader');
                    setTimeout(function() {
                        $('.content-ajax').append(response);
                        _functions.contentHeigh();
                        _functions.initSwiper();
                        $('.loader-ajax').removeClass('show-loader');
                    }, 1000);
                }
            });
        }

        if ( filterType.toLowerCase() === 'city' ) {
            allPlaces.forEach(function (country) {
                if ( country.name === filterCountry ) {
                    if ( country.city ) {
                        country.city.forEach(function(city) {
                            if ( city.name === filterCity ) {
                                addMarker(city.coordinates.lat, city.coordinates.lng, city.type, city.name, city.popupContent);

                                if ( city.places ) {
                                    city.places.forEach(function(place) {
                                        addMarker(place.coordinates.lat, place.coordinates.lng, place.type, place.name, place.popupContent);
                                    });
                                }
                            }
                        });
                        getBounds();
                        markersClusters = new MarkerClusterer(map, markers, {styles: clusterStyles});
                    }
                }
            });

            $.ajax({
                url: filterAjaxUrl,
                type: 'get',
                dataType: 'html',
                error: function (error) {
                    console.log(error);
                },
                success: function (response) {
                    $('.content-ajax').find('.content').remove();
                    $('.loader-ajax').addClass('show-loader');
                    setTimeout(function() {
                        $('.content-ajax').append(response);
                        _functions.contentHeigh();
                        _functions.initSwiper();
                        $('.loader-ajax').removeClass('show-loader');
                    }, 1000);
                }
            });
        }

        if ( filterType.toLowerCase() === 'category' ) {
            allPlaces.forEach(function (country) {
                if ( country.name === filterCountry ) {
                    if ( country.city ) {
                        country.city.forEach(function(city) {
                            if ( city.name === filterCity ) {

                                if ( city.places ) {
                                    city.places.forEach(function(place) {

                                    	if ( place.category ) {
                                    		place.category.forEach(function(category){

												if ( category === filterCategory ) {
		                                            addMarker(place.coordinates.lat, place.coordinates.lng, place.type, place.name, place.popupContent);
		                                        }

	                                    	});
                                    	}
                                    	
                                       
                                    });
                                }

                            }
                        });
                        getBounds();
                        markersClusters = new MarkerClusterer(map, markers, {styles: clusterStyles});
                    }
                }
            });
        }

        if ( filterType.toLowerCase() === 'place' ) {
            allPlaces.forEach(function (country) {
                if ( country.name === filterCountry ) {
                    if ( country.city ) {
                        country.city.forEach(function(city) {
                            if ( city.name === filterCity ) {

                                if ( city.places ) {
                                    city.places.forEach(function(place) {
                                    	console.log( place.name, filterCategory);
                                    	if ( place.name === filterCategory ) {
                                            addMarker(place.coordinates.lat, place.coordinates.lng, place.type, place.name, place.popupContent);

                                        }
                                    });
                                }

                            }
                        });
                        getBounds();
                        markersClusters = new MarkerClusterer(map, markers, {styles: clusterStyles});
                        markers.forEach(function(marker){
                         	previousPopup = marker;
                         	showInfowindow(marker);
                         });

                        $.ajax({
			                url: filterAjaxUrl,
			                type: 'get',
			                dataType: 'html',
			                error: function (error) {
			                    console.log(error);
			                },
			                success: function (response) {
			                    $('.content-ajax').find('.content').remove();
                                $('.loader-ajax').addClass('show-loader');
                                setTimeout(function() {
                                    $('.content-ajax').append(response);
                                    _functions.contentHeigh();
                                    _functions.initSwiper();
                                    $('.loader-ajax').removeClass('show-loader');
                                }, 1000);
			                }
			            });
                    }
                }
            });
        }
    }

    setTimeout(function () {
        initMap();

        $(document).on('click', '.closestPlaces', function () {
            closestPlaces(geoPlaceLatLng);
        });

        $(document).on('click', '.mapFilter.country', function () {
            filtering( $(this).data('filter-url'), $(this).data('filter-country'), $(this).data('filter-type') );
        });

        $(document).on('click', '.mapFilter.city', function () {
            filtering( $(this).data('filter-url'), $(this).data('filter-country'), $(this).data('filter-type'), $(this).data('filter-city') );
        });

        $(document).on('click', '.mapFilter.category', function () {
            filtering( $(this).data('filter-url'), $(this).data('filter-country'), $(this).data('filter-type'), $(this).data('filter-city'),  $(this).data('filter-category') );
        });

        $(document).on('click', '.marker-info', function () {




	        // var thisMarer = $(this).attr("data-marker-name");

	        // AllMarkesr.forEach(function(marker) {
	        // 	if ( marker.name === thisMarer ) {
	        // 		showInfowindow(marker);
	        // 		map.setZoom(16);
	        // 	}
	        // });
	    });

    },500);

});

function showPopupShare() {
    if ( document.querySelector('.shortcode-type10').classList.contains('showShare') ) {
        document.querySelector('.shortcode-type10').classList.remove('showShare');
    } else {
        document.querySelector('.shortcode-type10').classList.add('showShare');
    }
}

function closeSharePopup() {
    document.querySelector('.showShare').classList.remove('showShare');
}