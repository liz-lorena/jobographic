$(document).ready(function() {

    
    $("#getjobs_form").submit(function(event) {
        event.preventDefault();

        // Make quick references to our fields
        var l = $('#l').val(); //location
        var q = $('#q').val(); //keywords
        var action = 'employers';

        console.log(l); //shows up as undefined D:

        //Clear the errors and output 
        $('#errors').empty();
        $('#output').empty();

        // validate all form input, as needed
        var errorMessages = '';
        var emptyStringPattern = /^$/;

        if (emptyStringPattern.test(l)) {
            errorMessages += 'You must enter a location.';
        }

        if (errorMessages.length > 0) {
            alert(errorMessages);
            return false;
        }

        //shows the loading gif modal to show something is happening
        $("#ajaxIndicator").modal('show');

        //set user marker on map
        $('#gmap').attr("src", 'https://www.google.com/maps/embed/v1/place?key= &q=' + l);

        //Ajax call to glassdoorProxy.php file
        $.ajax({
            url: 'glassdoor/glassdoorProxy.php',
            datatype: 'json',
            type: 'GET',
            data: {
                l: l,
                q: q,
                action: action
            },
            success: function(serverResponse) { //output on success
                try {
                    console.log(serverResponse);
                    var employers = serverResponse.response.employers;
                    // console.log(employers);

                    if (employers.length == 0) {
                        $("#errors").append("No companies in " + l + " with " + q + ".");
                    }

                    for (var i = 0; i < employers.length; i++) {
                        var empReview = employers[i];
                        var template = $($("#empReview").prop("content")).children().clone();
                        if (empReview.squareLogo === "") {
                            empReview.squareLogo = "https://www.iconexperience.com/_img/g_collection_png/standard/512x512/office_building.png";
                        }
                        template.find(".name").text(empReview.name);
                        template.find(".logo").html('<img src=' + empReview.squareLogo + '>');
                        template.find(".overallRating").text('Overall Rating: ' + empReview.overallRating + '/5');
                        template.find(".website").html('<a href="http://' + empReview.website + '" target="_blank">' + empReview.website + '</a>');

                        if (empReview.ceo === undefined) {
                            template.find(".owner").text("");
                            template.find(".title").text("");
                        }
                        else {
                            template.find(".owner").text(empReview.ceo.title + ": " + empReview.ceo.name);
                        }

                        if (empReview.featuredReview == undefined || empReview.featuredReview.location == undefined) {
                            template.find(".reviewDateTime").text("");
                            template.find(".jobTitle").html("<p style='margin-bottom: -50%; margin-top: -12%; font-weight: normal'>No Featured Review Available.</p>");
                            template.find(".location").text("");
                            template.find(".headline").text("");
                            template.find(".pros").text("");
                            template.find(".cons").text("");
                            template.find(".overall").text("");
                            template.find("#directions").text();

                            //use company name for maps destination query
                            var destination = empReview.name;

                        }
                        else {
                            template.find(".reviewDateTime").text(empReview.featuredReview.reviewDateTime);
                            template.find(".jobTitle").text("Job Title: " + empReview.featuredReview.jobTitle);
                            template.find(".location").text("Location: " + empReview.featuredReview.location);
                            template.find(".headline").text("\"" + empReview.featuredReview.headline + "\"");
                            template.find(".pros").text("Pros: " + empReview.featuredReview.pros);
                            template.find(".cons").text('Cons: ' + empReview.featuredReview.cons);
                            template.find(".overall").text('Rating: ' + empReview.featuredReview.overall + '/5');

                            //use company name and reviewer location for maps destination query
                            var destination = empReview.name + ' ' + empReview.featuredReview.location;

                        } //end of if else statements determining if featured review is missing from company data


                        $('#output').append(template);

                        //send set source function call to find route buttons
                        destination = destination.replace(/\&+/g, "%20");
                        var dir = 'https://www.google.com/maps/embed/v1/directions?key= &origin=' + encodeURI(l) + '&destination=' + encodeURI(destination);
                        var send = 'setSrc("' + dir + '")';
                        template.find("#directions").attr('onclick', send);


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
