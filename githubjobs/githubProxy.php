<?php

    $url = 'https://jobs.github.com/positions.json?';
    $location = $_REQUEST['location'];
    $description = $_REQUEST['description'];
    $full_time = $_REQUEST['full_time'];
     
    $apiRequest = curl_init();
    $apiURL = ($url . 'description=' . urlencode($description) . '&location=' . urlencode($location) . '&full_time=' . $full_time); 

            //build GET Request to API
    curl_setopt($apiRequest, CURLOPT_URL, $apiURL); 
        curl_setopt($apiRequest, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($apiRequest, CURLOPT_POST, false);
        curl_setopt($apiRequest, CURLOPT_HTTPGET, true);
        curl_setopt($apiRequest, CURLOPT_FOLLOWLOCATION, true);
        
        
        $apiResponse = curl_exec($apiRequest);
        $apiCode = curl_getinfo($apiRequest, CURLINFO_HTTP_CODE);
        
        if ($apiResponse === FALSE || $apiCode != 200) {

            header("HTTP/1.1 $apiCode " . curl_error($apiRequest));
            print(curl_error($apiRequest) . $apiResponse);
        } 
        else {
            $contentType = curl_getinfo($apiRequest, CURLINFO_CONTENT_TYPE);
            if ($contentType) {
                header("Content-Type: " . $contentType);
            }
            print($apiResponse);//return Github Jobs response to Ajax call
        } 
        curl_close($apiRequest);


?>
