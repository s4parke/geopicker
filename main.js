$(document).ready(function() {
    
    // Detect if address, lat, and lng textboxes exist (find their labels)
    var addressLabel = $('.kn-input-label:contains("Address")'),
        latLabel = $('.kn-input-label:contains("Latitude")'),
        lngLabel = $('.kn-input-label:contains("Longitude")');
    if(addressLabel.length && latLabel.length && lngLabel.length) {
        
        // Get the textboxes themselves
        var addressInput = $('#' + addressLabel.parent('label').attr('for'));
        latInput = $('#' + latLabel.parent('label').attr('for')),
        lngInput = $('#' + lngLabel.parent('label').attr('for')),
        defaultMapOptions = {
            center: {lat: 39.9500, lng: -75.1667},
            zoom: 13
        };
        
        // Disable lat & lng textboxes
        latInput.attr('disabled', 'disabled');
        lngInput.attr('disabled', 'disabled');
        
        // Create a map underneath the address box
        var mapContainer = $('<div/>').addClass('geopicker').insertAfter(addressInput),
            map = new google.maps.Map(mapContainer.get(0), defaultMapOptions),
            geocoder = new google.maps.Geocoder(),
            marker = new google.maps.Marker({map: map, draggable: true});
            
        // If lat & lng already have a value, zoom to it and put the marker on it
        if(latInput.val() && lngInput.val()) {
            var latLng = {lat: parseFloat(latInput.val()), lng: parseFloat(lngInput.val())};
            map.setCenter(latLng);
            map.setZoom(18);
            marker.setPosition(latLng);
        }
        
        // When the address changes, geocode it and zoom to it
        addressInput.change(function() {
            var input = $(this).val();
            
            if(input) {
                // todo: enable loading indicator
                geocoder.geocode({'address': input, 'componentRestrictions': {
                    'country': 'US'
                }}, function(results, status) {
                    // todo: disable loading indicator
                    if(status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(18);
                        marker.setPosition(results[0].geometry.location);
                        latInput.val(results[0].geometry.location.lat());
                        lngInput.val(results[0].geometry.location.lng());
                    } else {
                        mapContainer.addClass('alert alert-warning').html('Google maps address lookup failed. Check API key and version in the relevant Javascript file.');
                    }
                });
            }
        });
        
        // When the user drags the marker, update the lat/lng
        google.maps.event.addListener(marker, 'dragend', function(e) {
            latInput.val(e.latLng.lat());
            lngInput.val(e.latLng.lng());
        });
    }
});
