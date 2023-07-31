$(document).ready(function() {

    $("#getjobs_form").submit(function(event) {
        event.preventDefault();

        // Make quick references to our fields
        var location = $('#l').val();
        var description = $('#q').val(); //description
        var full_time = $('#jt').val(); //job type (boolean)

        //Create array for returned jobs locations
        var locations;

        //Clear the errors and output 
        $('#errors').empty();
        $('#output').empty();

        // validate all form input, as needed
        var errorMessages = '';
        var emptyStringPattern = /^$/;

        if (emptyStringPattern.test(location)) {
            errorMessages += 'You must enter a location.';
        }

        if (errorMessages.length > 0) {
            alert(errorMessages);
            return false;
        }

        //shows the loading gif modal to show something is happening
        $("#ajaxIndicator").modal('show');


        //Ajax call to githubProxy.php file
        $.ajax({
            url: 'githubjobs/githubProxy.php',
            datatype: 'JSON',
            type: 'GET',
            data: {
                location: location,
                description: description,
                full_time: full_time
            },
            success: function(serverResponse) { //output on success
                try {

                    console.log(serverResponse);
                    var positions = serverResponse;
                    console.log(positions);

                    for (var i = 0; i < positions.length; i++) {
                        var position = positions[i];
                        var template = $($("#job").prop("content")).children().clone();

                        template.find(".title").text(position.title);
                        template.find(".location").text(position.location);
                        template.find(".type").text(position.type);
                        template.find(".url").html('<a href="' + position.url + '" target="_blank">Read More at Github Jobs</a>');
                        template.find(".how_to_apply").html('<br>How to Apply:' + position.how_to_apply);
                        template.find(".company").text('By ' + position.company);
                        if (position.company_logo != null) {
                            template.find(".company_logo").html('<img src=' + position.company_logo + '>');
                        }
                        else {
                            template.find(".company_logo").html('');
                        }
                        if (position.company_url != null) {
                            template.find(".company_url").html('<a href=' + position.company_url + 'target="_blank">' + position.company_url + '</a>');
                        }
                        else {
                            template.find(".company_url").html('');
                        }
                        template.find(".created_at").text('Posted: ' + position.created_at);

                        $('#output').append(template);
                        
                        var address = position.location;
                        geocoder.geocode({ 'address': address }, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) { // if everything went OK
                                map.setCenter(results[0].geometry.location); // set new center
                                
                                var marker = new google.maps.Marker({
                                position: results[0].geometry.location,
                                map: map,
                                title: position.title,
                                icon: 'img/places.png'
                                });
                                
                                var infowindow = new google.maps.InfoWindow({
                                    content: position.location + ' ' + position.title
                                });
                                
                                google.maps.event.addListener(marker, 'click', function() {
                                    infowindow.open(map, marker);
                                });
                                
                                map.setZoom(5);
                                
                                //marker.setPosition(results[0].geometry.location); // re-position the marker****
                                //infowindow.setContent(results[0].address_components[0].long_name); // set content of the info window to the name of the place
                                infowindow.setContent(template); // set content of the info window to the name of the place

                            } else {
                                //alert("Geocode was not successful for the following reason: " + status); 
                            }
                            
                        });
                    }

                }
                catch (ex) {
                    console.error(ex);
                    $('#errors').text("An error occured during processing");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) { //outputs errors on failure
                console.log('error');
                console.log(errorThrown);
                console.log(jqXHR);
                if (errorThrown == 'Service Unavailable') {
                    $('#errors').append('<p>Your Cloud9 isn\'t running!</p>');
                }
                else {
                    $('#errors').append('<p>An unknown error ocurred: ' + errorThrown + '!</p>');
                }
                $("#ajaxIndicator").modal('hide');
            },
            complete: function() { //hide loading gif modal when call is complete
                $("#ajaxIndicator").modal('hide');
            }
        });
    });
});


var geocoder;
var map;
var marker;
var infowindow;

function initMap() {

    geocoder = new google.maps.Geocoder();
    var myLatlng = new google.maps.LatLng(40.500959, -74.447408);
    var mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "My Marker",
        icon: 'img/places.png'
    });

    infowindow = new google.maps.InfoWindow({
        content: "content of my info window with html tags enabled"
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}


/* // Create an array of alphabetical characters used to label the markers.
            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            // Add some markers to the map.
            // Note: The code uses the JavaScript Array.prototype.map() method to
            // create an array of markers based on a given "locations" array.
            // The map() method here has nothing to do with the Google Maps API.
            var markers = locations.map(function(location, i) {
              return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
              });
            });

            // Add a marker clusterer to manage the markers.
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
          */


/*function codeAddress() {
            var address = getDocumentByID('location').value(); // get the address
            // geocode the address and call an anonymous function as a callback
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) { // if everything went OK
                    map.setCenter(results[0].geometry.location); // set new center
                    marker.setPosition(results[0].geometry.location); // re-position the marker
                    infowindow.setContent(results[0].address_components[0].long_name); // set content of the info window to the name of the place
                } else {
                    alert("Geocode was not successful for the following reason: " + status); // ugly alert
                }
            });
        }*/

var locations = [
    { lat: -31.563910, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.750000, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.773700, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438000 },
    { lat: -43.999792, lng: 170.463352 }
];
