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
var infoWindow;
//Foursquare API cedentials
var clientID = 'IDTZ0OV11IFQA2NU4HS4RFAI1OFTZUSYQGMJX4TIC1EG0BMK';
var clientSecret = 'NTZSU0QQRRNU3C3R3HJL4AK0LYKUQEH5MRZLPMPQUPD2DJFF';

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
  infoWindow = new google.maps.InfoWindow();

  ko.applyBindings(new AppViewModel());

  // Google Map Error!
  function googleMapsError() {
    alert('Google Maps did not load properly, please try again!');
  }

}

// Location and Foursquare Model
var LocationMarker = function(data) {
  var self = this;

  this.title = data.title;
  this.position = data.location;
  this.street = '',
    this.city = '';

  this.visible = ko.observable(true);

  // JSON request data
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180323' + '&query=' + this.title;

  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0] : 'No Address Provided';
    self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1] : 'No Address Provided';
  }).fail(function() {
    alert('There was an error with Foursquare API call, please try again.');
  });


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

  this.marker.addListener('click', function() {
    populateInfoWindow(this, self.street, self.city, infoWindow);
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

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, street, city, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + marker.position + '' + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

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
