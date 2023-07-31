<?php

$keyAlternative = " ";
$mainKey = " ";

$url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
$key = "key= &input=";
$input = $_REQUEST['input'];
$input = urlencode($input);
$input = $input . "&components=country:us";



$url = $url . $key;
$url = $url . $input;
//$handle stores a reference to the file
//fopen() opens url, parameter 'r' reads the file
$handle =  fopen($url, "r" );

//reads line by line to the end of file
if ($handle) {
    while (!feof($handle))
    {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
//closes connection
    fclose($handle);
    
}

?>
