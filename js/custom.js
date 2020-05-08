// Collapse navbar when moving map
function collapseNavbar(e) {
    if ($("#navbarToggler").hasClass("show")) {
        $("#navbarToggler").collapse("hide");
    }
}

map.on('mousedown', collapseNavbar)

// Show user location marker on map

const blueDot = L.icon({
    iconUrl: 'images/bluedot.gif',
    iconSize: [70, 70],
    iconAnchor: [35, 60],
})

let activeMarker;
let activeCircle;

function onLocationFound(e) {
    var radius = e.accuracy;

    if (typeof activeMarker !== "undefined")
        map.removeLayer(activeMarker);

    if (typeof activeCircle !== "undefined")
        map.removeLayer(activeCircle);

    activeMarker = L.marker(e.latlng, {icon: blueDot}).addTo(map)
    activeCircle = L.circle(e.latlng, radius).addTo(map);

    updateGpsTrack(e.latlng);

    console.log(e.latlng);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Create localization control element

L.Control.Localization = L.Control.extend({
    onAdd: function (map) {
        let img = L.DomUtil.create('img');

        L.DomUtil.addClass(img, "icon-localization");

        return img;
    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.localization = function (opts) {
    return new L.Control.Localization(opts);
}

L.control.localization({position: 'topleft'}).addTo(map);

$(".icon-localization").on("click", toggleLocalization);


// Handle GPS logging

let gpsOn = false;

function locateMe(e) {
    if (gpsOn) {
        map.locate();
        setTimeout(locateMe, 1000);
    }
}

function toggleLocalization(e) {
    if (!gpsOn) {
        gpsOn = true;

        map.locate({setView: true, maxZoom: 16});

        $(this).css("background-image", "url(../images/localization_activated.png)");
        setTimeout(locateMe, 100);

    } else {
        gpsOn = false;

        map.removeLayer(activeMarker);
        map.removeLayer(activeCircle);

        $(this).css("background-image", "url(../images/localization.png)");
    }
}

// Draw GPS track

let gpsTrack;
let gpsLocations = [];

function updateGpsTrack(latlng) {
    gpsLocations.push([latlng['lat'], latlng['lng']]);

    if (typeof gpsTrack !== "undefined")
        map.removeLayer(gpsTrack);

    gpsTrack = L.polyline(gpsLocations, {color: 'red'}).addTo(map);
}

// Handle Search button

const geocoderUrl = "https://geodata.nationaalgeoregister.nl/locatieserver/v3/free";

function findAndCenterLocation(e) {
    e.preventDefault();

    let searchQuery = $("#searchInput").val();

    if (searchQuery.length > 0) {

        $.getJSON(geocoderUrl, {
            q: searchQuery
        })
            .done(function (data) {
                if (data['response']['docs'].length > 0) {
                    console.log(data);
                    resultCoordinatesPoint = data['response']['docs'][0]['centroide_ll'];
                    console.log(resultCoordinatesPoint);
                    latLng = resultCoordinatesPoint.split("(")[1].split(")")[0].split(" ");
                    map.setView(new L.LatLng(latLng[1], latLng[0]), 9, {animation: true});
                } else {
                    window.alert("Location not found!");
                }
            })
            .fail(function (data) {
                window.alert("Location not found!");
            });
    }
}


$("#searchButton").on("click", findAndCenterLocation);


