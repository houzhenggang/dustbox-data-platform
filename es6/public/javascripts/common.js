// On create and edit stream.
// jquery disable form submit on enter
// http://stackoverflow.com/questions/11235622/jquery-disable-form-submit-on-enter
$('form').on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

// On create and edit stream.
//  keycode for enter (13), comma (44) and space (32)
//  http://stackoverflow.com/questions/24554629/how-to-submit-a-tag-with-bootstrap-tags-input-plugin-with-space-key
$('.tag-input').tagsinput({
    confirmKeys: [13, 32, 44]
});

// On make stream.
// Add new variable input if add button clicked
$(".add-variable-btn").click(function(e) {
    e.preventDefault(); // prevents button from submitting
    var id = Date.now();
    var html = '<li class="add-variable">\
                <div class="row">\
                    <div class="col-md-5 col-sm-5 col-xs-5">\
                        <input type="text" class="form-control" name="species[%s][public_name]" placeholder="Pulic Name" required>\
                    </div>\
                    <div class="col-md-5 col-sm-5 col-xs-5">\
                        <input type="text" class="form-control" name="species[%s][code_name]" placeholder="Code Name" required>\
                    </div>\
                    <div class="col-md-2 col-sm-2 col-xs-2">\
                        <button class="btn btn-link delete-variable-btn"><span class="glyphicon glyphicon-minus-sign"></span></button>\
                    </div>\
                </div>\
            </li>'.replace(/%s/g, id);
    $( "#speciesList" ).append(html);
});

// Delete variable input if delete button clicked
// we use the 'on' method here because otherwise newly inserted DOM elements wouldn't trigger 'click'
$(document).on("click", ".delete-variable-btn", function(e) {
    e.preventDefault(); // prevents button from submitting

    $(this).closest("li").remove();
    varId--;
});

// On edit stream.
$("#edit-stream").click(function(){
    $(this).parents('.manage-controls').hide();
    $('.edit-container').show();
});

// On show stream data.
$.fn.toLocaleDateTime = function() {
    $(this).each(function(index) {
        // console.log(index + ": " + $(this).text());
        var timestamp = $(this).text();

        // parses a string and returns an integer.
        var date = new Date(parseInt(timestamp));

        // request a weekday along with a long date
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };
        // an application may want to use UTC and make that visible
        options.timeZone = 'Europe/London';

        return $(this).text(date.toLocaleDateString('en-GB', options));
    });
};

$('.timestamp').toLocaleDateTime();

// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
// http://stackoverflow.com/questions/35334324/populate-the-longitude-and-latitude-using-google-maps-api
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentAddress = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};
var componentLatLong = {
    lat: 'latitude',
    lng: 'longitude',
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    // console.log(place.geometry.location.lat()); // latitude
    // console.log(place.geometry.location.lng()); // longtitude
    // console.log(place.formatted_address); // city, state, country

    // Empty the value first before adding the val.
    $("input[type=hidden][name*='location']").val('');

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentAddress[addressType]) {
            var val = place.address_components[i][componentAddress[addressType]];
            console.log(addressType + ': ' + val);
            // http://stackoverflow.com/questions/9252217/javascript-name-array-input-selectors-namesometext
            $("input[name='location[" + addressType + "]']").val(val);
        }
    }

    for (var key in place.geometry.location) {
        if (componentLatLong[key]) {
            $("input[name='location[" + key + "]']").val(place.geometry.location[key]());
        }
    }
}

// Generate API key at: https://console.developers.google.com/apis/credentials?project=rapid-entry-134523
// Live server key: AIzaSyC1t--rpDuQEhW_zE7s8zVquwcRMaW3tRY
// Only attach google places library when #autocomplete exists.
// http://stackoverflow.com/questions/16372380/use-tags-script-with-if-and-else
if ($('#autocomplete').length > 0) {
    $('head').append(' <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCgR6j1vi4GdwgcI31UOIaHxytDamsszOc&libraries=places&callback=initAutocomplete" async defer></script>')
}

// function toLocaleDateTime(timestamp) {
//     var date = new Date(timestamp);

//     // request a weekday along with a long date
//     var options = {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         second: 'numeric',
//     };
//     // an application may want to use UTC and make that visible
//     options.timeZone = 'UTC';

//     return date.toLocaleDateString('en-GB', options);
// }

// bootstrap javascript check on small screen
// http://www.jasny.net/bootstrap/javascript/#offcanvas
// http://stackoverflow.com/questions/14441456/how-to-detect-which-device-view-youre-on-using-twitter-bootstrap-api
// http://stackoverflow.com/questions/20181219/twitter-bootstrap-how-to-detect-when-media-queries-starts
// var slideShown = false;
// $('.navmenu').on('shown.bs.offcanvas', function() {
//     console.log('shown');
//     slideShown = true;
// })

// $(window).bind('resize', function() {
//     console.log(findBootstrapEnvironment());
//     if (findBootstrapEnvironment() == "ExtraSmall" && slideShown === true) {
//         //console.log($('.navmenu').is(':hidden'));
//         $('.navmenu').offcanvas('hide');
//         $('.navmenu').on('hiden.bs.offcanvas', function() {
//             console.log('hidden');
//             slideShown = false;
//         })
//     }
// });

// function findBootstrapEnvironment() {
//     var envs = ["ExtraSmall", "Small", "Medium", "Large"];
//     var envValues = ["xs", "sm", "md", "lg"];

//     var $el = $('<div>');
//     $el.appendTo($('body'));

//     for (var i = envValues.length - 1; i >= 0; i--) {
//         var envVal = envValues[i];

//         $el.addClass('hidden-'+envVal);
//         if ($el.is(':hidden')) {
//             $el.remove();
//             return envs[i]
//         }
//     };
// }
