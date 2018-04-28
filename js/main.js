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
    title: 'Canton Town Hall',
    location: {
      lat: 42.159085,
      lng: -71.144307
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
  this.phone = '';

  this.visible = ko.observable(true);

  // JSON request data
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180323' + '&query=' + this.title;

  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0] : 'No Address Provided';
    self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1] : 'No Address Provided';
    self.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
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
    populateInfoWindow(this, self.street, self.city, self.phone, infoWindow);
    toggleBounce(this);
    map.panTo(this.getPosition());
  });

  // Shows locations when clicked from lcoation list
  this.showLocation = function(location) {
    google.maps.event.trigger(self.marker, 'click');
  };

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

  this.searchTerm = ko.observable('');

  // add location markers for each location
  defaultLocations.forEach(function(location) {
    self.mapLocations.push(new LocationMarker(location));
  });

  this.locationFilter = ko.computed(function() {
    var searchFilter = self.searchTerm().toLowerCase();
    if (searchFilter) {
      return ko.utils.arrayFilter(self.mapLocations(), function(location) {
        var str = location.title.toLowerCase();
        var result = str.includes(searchFilter);
        location.visible(result);
        return result;
      });
    }
    self.mapLocations().forEach(function(location) {
      location.visible(true);
    });
    return self.mapLocations();
  }, self);
};


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, street, city, phone, infowindow) {
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    var windowContent = '<h4>' + marker.title + '</h4>' +
      '<p>' + street + "<br>" + city + '<br>' + phone + "</p>";

    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    var getStreetView = function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        infowindow.setContent(windowContent + '<div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 20
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
      }
    };
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
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

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 4200);
  }
}
