$(document).ready(function(){
    $(".card-header:has(a)").click(function(){
        console.log("card-header clicked");
        $('div').removeClass('activeCard');
        $(this).addClass("activeCard");
    });
});