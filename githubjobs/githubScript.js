$(document).ready(function() {

    $("#getjobs_form").submit(function(event) {
        event.preventDefault();

        // Make quick references to our fields
        var location=$('#l').val(); //location
        var description = $('#q').val(); //description
        var full_time = $('#jt').val(); //job type (boolean)
        
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

        //set user marker on map
        $('#gmap').attr("src", 'https://www.google.com/maps/embed/v1/place?key= &q=' + location);

        // var encoded = location.replace(/\s+/g, "+");
        // console.log(encoded);

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
                    var destination;
                    
                    //if no positions based on input
                    if(positions.length == 0 && full_time == "true"){
                        $("#errors").append("No full-time positions in " + location + " with " + description + ".");
                    } else if(positions.length == 0 && full_time != "true"){
                        $("#errors").append("No positions in " + location + " with " + description + ".");
                    }

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
                        } //end of if else statements determining if certain elements are returned in postings
                        template.find(".created_at").text('Posted: ' + position.created_at);
                        
                        //send function call and source to find route buttons
                        var destination=position.company + ' ' + position.location;
                        destination = destination.replace(/\&+/g, "%20");
                        var dir='https://www.google.com/maps/embed/v1/directions?key= &origin=' + encodeURI(location) + '&destination=' + encodeURI(destination);
                        var send='setSrc("' + dir + '")';
                        template.find("#directions").attr('onclick', send);
                        console.log(dir);
                        
                        
                        $('#output').append(template);
                          
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

