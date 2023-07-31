/*global $*/
$(document).ready(function() {

    $("#getjobs_form").submit(function(event) {
        event.preventDefault();
        
        // Make quick references to our fields
        var l = $('#l').val(); //location
        var q = $('#q').val(); //keywords
        var action = 'employers'; 
        //var jc = $('#jc').val();
        // var action = 'jobs-stats';
        var employerID = $('#employerID').val(); //for reviews

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
                    var employers=serverResponse.response.employers;
                    console.log(employers);
                    for(var i=0; i<employers.length; i++){
                        var empReview=employers[i];
                        var template=$($("#empReview").prop("content")).children().clone();
                        
                        template.find(".name").text(empReview.name);
                        template.find(".logo").html('<img src=' + empReview.squareLogo + '>');
                        template.find(".overallRating").text('Overall Rating: ' + empReview.overallRating + ' out of 5');

                        
                        if(empReview.ceo===undefined){
                            template.find(".owner").text("");
                            template.find(".title").text("");
                            template.find(".reviewDateTime").text("");
                            template.find(".jobTitle").text("");
                            template.find(".location").text("");
                            template.find(".headline").text("");
                            template.find(".pros").text("");
                            template.find(".cons").text("");
                            template.find(".overall").text("");
                            
                        }else{
                            template.find(".owner").text(empReview.ceo.name);
                            template.find(".title").text(empReview.ceo.title);
                        }
                        
                        if(empReview.featuredReview===undefined){
                            template.find(".owner").text("");
                            template.find(".title").text("");
                            template.find(".reviewDateTime").text("");
                            template.find(".jobTitle").text("");
                            template.find(".location").text("");
                            template.find(".headline").text("");
                            template.find(".pros").text("");
                            template.find(".cons").text("");
                            template.find(".overall").text("");
                        }else{
                            template.find(".reviewDateTime").text(empReview.featuredReview.reviewDateTime);
                            template.find(".jobTitle").text(empReview.featuredReview.jobTitle);
                            template.find(".location").text(empReview.featuredReview.location);
                            template.find(".headline").text(empReview.featuredReview.headline);
                            template.find(".pros").text('Pros: ' + empReview.featuredReview.pros);
                            template.find(".cons").text('Cons: ' + empReview.featuredReview.cons);
                            template.find(".overall").text('Rating: ' + empReview.featuredReview.overall + ' out of 5');
                        }
                        
                            
                        $('#output').append(template);
                        console.log(empReview.ceo);
                        console.log(!(empReview.ceo===undefined));
                    }
                    
                    
                } catch(ex){
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
                } else {
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

