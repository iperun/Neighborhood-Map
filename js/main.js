  var map;

// Google Map & Styling
  function initMap() {
    "use strict";
    var styles = [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#f5f5f5"
        }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#f5f5f5"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#bdbdbd"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#eeeeee"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e5e5e5"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dadada"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e5e5e5"
        }]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
          "color": "#eeeeee"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#c9c9c9"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      }
    ];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 42.158776,
        lng: -71.145639
      },
      zoom: 13,
      styles: styles,
      mapTypeControl: false
    });
    ko.applyBindings(new AppViewModel());

}

// Google Map Error!
  function googleMapsError() {
      alert('Google Maps did not load properly, please try again!');
  }

//Knockout's View Model
var AppViewModel = function () {
    var self = this;


    var Locations = [{
        title: 'Canton Public Library',
        location: {
          lat: 42.158776,
          lng: -71.145639
        }
      },
      {
        title: 'Amber Road Cafe',
        location: {
          lat: 42.153988,
          lng: -71.145644
        }
      },
      {
        title: 'Dance Out',
        location: {
          lat: 42.162805,
          lng: -71.160362
        }
      },
      {
        title: 'The Grape Leaf',
        location: {
          lat: 42.152014,
          lng: -71.148062
        }
      },
      {
        title: 'Canton Junction Sports Pub',
        location: {
          lat: 42.160281,
          lng: -71.155584
        }
      },
      {
        title: 'Childrens World Indoor Playground',
        location: {
          lat: 42.166293,
          lng: -71.110358
        }
      }
    ];

    document.getElementById('go-places').addEventListener('click', textSearchPlaces);
  }
