// Default Locations
var defaultLocations = [{
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

var map;
var bounds;

// Google Map & Styling
function initMap() {
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

  bounds = new google.maps.LatLngBounds();

  ko.applyBindings(new AppViewModel());

}

// Location and Foursquare Model
var LocationMarker = function(data) {
  var self = this;

  this.title = data.title;
  this.position = data.location;

  this.visible = ko.observable(true);

  // Marker styling
  var defaultIcon = makeMarkerIcon('bb99ff');

  var highlightedIcon = makeMarkerIcon('33334d');

  // Create location markers
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon
  });

  // Show marker and extend bounds
  self.filterMarkers = ko.computed(function() {
    if (self.visible() === true) {
      self.marker.setMap(map);
      bounds.extend(self.marker.position);
      map.fitBounds(bounds);
    } else {
      self.marker.setMap(null);
    }
  });

  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  this.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  this.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });


};

//Knockout's View Model
var AppViewModel = function() {
  var self = this;

  this.mapLocations = ko.observableArray([]);

  // add location markers for each location
  defaultLocations.forEach(function(location) {
    self.mapLocations.push(new LocationMarker(location));
  });

};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

// Google Map Error!
function googleMapsError() {
  alert('Google Maps did not load properly, please try again!');
}
