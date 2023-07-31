<?php

    $url = 'http://api.glassdoor.com/api/api.htm?v=';
    $l = $_REQUEST['l'];
    $q = $_REQUEST['q'];
    $v='1';
    $format='json';
    $tp=' '; 
    $tk=' ';
    $userip='127.0.0.1'; 
    $useragent = $_SERVER['HTTP_USER_AGENT'];
    $action = $_REQUEST['action'];
     
    $apiRequest = curl_init();
    $apiURL = ($url . $v . '&format=' . $format . '&t.p=' . $tp . '&t.k=' . $tk . '&action=' . $action . '&q=' . urlencode($q) . '&l=' . urlencode($l)); 

    //build GET Request to API
    curl_setopt($apiRequest, CURLOPT_URL, $apiURL); 
    curl_setopt($apiRequest, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($apiRequest, CURLOPT_POST, false);
    curl_setopt($apiRequest, CURLOPT_HTTPGET, true);
    curl_setopt($apiRequest, CURLOPT_FOLLOWLOCATION, true);
        
        
    $apiResponse = curl_exec($apiRequest);
    $apiCode = curl_getinfo($apiRequest, CURLINFO_HTTP_CODE);
        
    //check response for errors
    if ($apiResponse === FALSE || $apiCode != 200) {

        header("HTTP/1.1 $apiCode " . curl_error($apiRequest));
        print(curl_error($apiRequest) . $apiResponse);
    } 
    else {
        $contentType = curl_getinfo($apiRequest, CURLINFO_CONTENT_TYPE);
        if ($contentType) {
            header("Content-Type: " . $contentType);
        }
        print($apiResponse);//return Glassdoor Company reviews response to Ajax call
    } 
    curl_close($apiRequest);


?>
