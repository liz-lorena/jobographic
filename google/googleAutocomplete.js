$(document).ready(function(){

    var xTriggered = 0;
    $('.addressInput').keydown(function(event){ 
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
    
    
    $('.addressInput').keyup(function(event){
      
        
        if (!(event.keyCode==40) && !(event.keyCode==38) && !(event.which==13)){
        queryautocomplete();
        //console.log(event.keyCode);
        $('#querrySuggestion').on('click', function(event) {
            var x = $(event.target).text();
            $('.addressInput').val(x);
            $('.addressSuggestion').hide();
             });
             

    
    
        }
        
        else if (event.keyCode==40 && xTriggered<$("#querrySuggestion").children().length){
            
            $(".addressSuggestion:eq("+ xTriggered +")").addClass("highlightSuggestion");
            xTriggered ++;
            $(".addressSuggestion:eq("+ (xTriggered-2) +")").removeClass("highlightSuggestion");
            //console.log(xTriggered);
        }
        
        else if (event.keyCode==38 && xTriggered>1){
            xTriggered--;
            $(".addressSuggestion:eq("+ (xTriggered-1) +")").addClass("highlightSuggestion");
            $(".addressSuggestion:eq("+ (xTriggered) +")").removeClass("highlightSuggestion");
            
            //console.log(xTriggered);
        }
        
        if(event.which==13){
            var x = $('#querrySuggestion').find( '.highlightSuggestion').text();
            $('.addressInput').val(x);
            $('.addressSuggestion').hide();
        }
        
    });

});


function queryautocomplete(){
    
    var addressQuerry = $('.addressInput').val();
    //console.log(addressQuerry);
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        console.log(myObj);
        var outputS = "";
       $('#querrySuggestion').html(outputS);
       for (var i = 0; i < myObj.predictions.length; i++) {

            outputS += "<div class='addressSuggestion' id='";
            outputS += i;
            outputS += "'>";
            outputS += myObj.predictions[i].description;
            //outputS += ' ' + myObj.predictions[i].place_id;
            console.log(myObj.predictions[i].place_id);
            outputS += '</div>';
            $('#querrySuggestion').html(outputS);
            //console.log(myObj.predictions[i]);
            }
        
        $('#querrySuggestion').append('</div>');
        
        }
        
        
    };
    xmlhttp.open("GET", "/google/googleAutocompleteProxy.php?input=" + addressQuerry, true);
    xmlhttp.send();
    
    
    
     
    
}
