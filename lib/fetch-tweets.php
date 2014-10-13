<?php

/**
 *  Fetch tweets from United’s Twitter channel
 * @author: jabran@united-agency.co.uk
 * @package: United Website
 *
 */

require_once('./Fetchwitter.php');

// output result
$result = array();

// Configurations
$config = array(
    'api_key' => 'Bj2b505JliD7r7LsPFErsMwHN',
    'api_secret' => 'tfaaAdquxIAFtyX71n7oa9trYLuct3IJiHEkGvDNVEVPJjpxrQ',
    'count' => '2'
);

// Setup a new instance of Fetchwitter
try {
    $fw = new Fetchwitter($config);
}
catch(Exception $e) {
    echo $e->getMessage();
}

// Make sure that you have the instance ready
if ( isset($fw) && $fw ) {

    if ( ! session_start() && ! session_id() ) session_start();

    if ( ! isset($_SESSION['ua_twitter_feed_access_token']) ) {

        // Get an access token for first time
        try {
            $accessToken = $fw->get_new_access_token();
        }
        catch(Exception $e) {
            echo $e->getMessage();
        }
    }
    else {
        // Assign an existing cached access token
        $fw->set_access_token($_SESSION['ua_twitter_feed_access_token']);
    }

    if ( $fw->get_access_token() ) {
        $result = json_decode($fw->get_by_user('influenceDGTL', 2));
    }
}

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=UTF-8');
echo json_encode($result);