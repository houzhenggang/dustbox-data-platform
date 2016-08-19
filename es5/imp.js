/*****************************************************************
DustBox Imp (Agent)
Post data to DustBox's data stream server system (dustbox) using
an Electric Imp
Citizen Sense @ DustBox
Original Creation Date: July 20, 2016

Description

Before uploading this sketch, there are a number of vars that need adjusting:
1. DustBox Stuff: Fill in your data stream's public, private, and
data keys before uploading!

Distributed as-is; no warranty is given.
*****************************************************************/

///////////////////
// DustBox Stuff //
///////////////////
local publicKey = "mTLUOAuw2rbQOQ4BuyOJESI5xmB"; // Your DustBox public key
local privateKey = "RuLvQs4ei5Ph3rrYWG0AhddM87k"; // The DustBox private key
local dustboxServer = "139.162.208.52:3000"; // Your DustBox server, base URL, no HTTP

/////////////////////
// postData Action //
/////////////////////
// When the agent receives a "postData" string from the device, use the
// dataString string to construct a HTTP POST, and send it to the server.
device.on("postData", function(dataString) {

    server.log("Sending " + dataString); // Print a debug message

    // Construct the base URL: https://data.dustbox.com/input/PUBLIC_KEY:
    local dustboxURL = "http://" +  dustboxServer + "/input/" + publicKey;
    // Construct the headers: e.g. "DustBox-Priave-Key: PRIVATE_KEY"
    local dustboxHeaders = {"DustBox-Private-Key": privateKey, "connection": "close"};
    // Send the POST to dustboxURL, with dustboxHeaders, and dataString data.
    local request = http.post(dustboxURL, dustboxHeaders, dataString);

    // Get the response from the server, and send it out the debug window:
    local response = request.sendsync();
    server.log("DustBox response: " + response.body);
});
