// JavaScript File/*global $*/
$(document).ready(function() {

  




    $("#getjobs_form").submit(function(event) {
        event.preventDefault();
        
        // Make quick references to our fields
        var l = $('#l').val();
        var q = $('#q').val(); //keywords
        var action = 'employers';
        var employerID = $('#employerID').val(); //for reviews

        //Clear the errors and output 
        $('#errors').empty();
        $('#output').empty();
      //  $("#accordion").children[1].empty();
        $("#empReview").nextAll(".card").remove();
        
        
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
                   // console.log(serverResponse);
                    var employers=serverResponse.response.employers;
                   // console.log(employers);
                    for(var i=0; i<employers.length; i++){
                        var empReview=employers[i];
                        var card=$($("#empReview").prop("content")).children().clone();
                        
                        //this checks for broken img scr, replaces if true
                        if (empReview.squareLogo === "" ) {
                            empReview.squareLogo = "https://www.iconexperience.com/_img/g_collection_png/standard/512x512/office_building.png"; 
                            }
                        if (empReview.ceo===undefined){
                            empReview.ceo = "";
                            if (empReview.ceo.title===undefined){
                                empReview.ceo.title = "";
                            }
                        }
                        if (empReview.featuredReview===undefined){
                            empReview.featuredReview = "";
                            if (empReview.featuredReview.cons===undefined){
                                empReview.featuredReview.cons = "";
                            }
                            
                            if (empReview.featuredReview.location === undefined){
                                empReview.featuredReview.location = "";
                            }
                            if (empReview.featuredReview.headline === undefined){
                                empReview.featuredReview.headline = "";
                            }     
                        }
                        if (empReview.reviewDateTime===undefined){
                            empReview.reviewDateTime = "";
                        }
                        if (empReview.featuredReview.pros===undefined){
                            empReview.featuredReview.pros = "";
                        }
                        
                        console.log(empReview);
                        card.find(".logo").html('<img src=' + empReview.squareLogo + '>');
                        card.find(".name").text(empReview.name);
                        card.find(".reviewDateTime").text('Review Date: ' + empReview.featuredReview.reviewDateTime);
                        card.find(".jobTitle").text('Job title: ' + empReview.featuredReview.jobTitle);
                        card.find(".location").text(empReview.featuredReview.location);
                        card.find(".headline").text(empReview.featuredReview.headline);
                        card.find(".pros").text('Pros: ' + empReview.featuredReview.pros);
                        card.find(".cons").text('Cons: ' + empReview.featuredReview.cons);
                        card.find(".overall").text("Rating: " + empReview.overallRating + "/5");
                        card.find(".owner").html("<b>Executive: </b>" + empReview.ceo.name);
                        card.find(".title").text(empReview.ceo.title);
                        card.find(".direction").val(empReview.name);

                        card.find("#heading0").attr("id", ("heading" + (i+1)));
                        card.find("#collapse0").attr("id",("collapse" + (i+1)));
                        card.find("#c0").attr({"id":("c" + (i+1)), "href": ("#collapse" + (i+1))});

                        $('#accordion').append(card);
                        $("#card0").attr("id", ("card" + (i+1)));
                        $("#dirBtn0").attr("id", ("dirBtn" + (i+1)));
                        
                        $(".overall:eq(" + i + ")" ).attr("rating", (empReview.overallRating));
                        
                        var rates = ($(".overall:eq(" + i + ")" ).attr("rating"));
                        
                        if ( ($(".overall:eq(" + i + ")" ).attr("rating")) >= 4   ){
                            $(".overall:eq(" + i + ")" ).addClass("good");
                        }
                        
                        else if ( rates <= 3.9  && rates >=3 ){
                            $(".overall:eq(" + i + ")" ).addClass("ok");
                        }
                        
                        else if ( rates <= 2.9  && rates > 0 ){
                            $(".overall:eq(" + i + ")" ).addClass("ok");
                        }
                        
                        else {}
                        //$('.overall').attr("textContent", empReview.overallRating);
                            
                        console.log(   ($(".overall:eq(" + i + ")" ).attr("rating")));
     
                        
                        $('span:contains("undefined")').remove();
                        $('span:contains("{{location}}")').remove();
                        $('span:contains("{{headline}}")').remove();
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

