// Credits to Martijn and Marian from GEO1007 Assignment 2 Lab 4


const RD = new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', {
    resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420],
    bounds: L.bounds([-285401.92, 22598.08], [595401.9199999999, 903401.9199999999]),
    origin: [-285401.92, 22598.08]
});

const map = new L.Map('map-canvas', {
    crs: RD,
    zoom: 6,
    minZoom: 5,
});
map.setView([52.070, 4.316667], 7);
map.attributionControl.setPrefix('');


const basemap_pdok = new L.TileLayer('http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 13,
    tms: true,
    errorTileUrl: 'http://www.webmapper.net/theme/img/missing-tile.png',
});
basemap_pdok.getAttribution = function () {
    return 'BRT Achtergrondkaart <a href="http://www.kadaster.nl">Kadaster</a>.';
}
basemap_pdok.addTo(map);

const wms_ahn3 = "https://geodata.nationaalgeoregister.nl/ahn3/ows?SERVICE=WMS&";
const ahn3_pdok = new L.tileLayer.wms(wms_ahn3, {
    layers: ['ahn3_5m_dtm'],
    styles: '',
    crs: RD,
    format: 'image/png',
    pointerCursor: true
});
ahn3_pdok.getAttribution = function () {
    return 'AHN3 Hoogtebestand <a href="http://www.kadaster.nl">Kadaster</a>.';
}

const wms_aerial = "https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?";
const basemap_aerial = new L.tileLayer.wms(wms_aerial, {
    layers: ['Actueel_ortho25'],
    styles: '',
    crs: RD,
    format: 'image/png',
    transparent: true,
    pointerCursor: true
});
basemap_aerial.getAttribution = function () {
    return 'Luchtfoto WMS <a href="http://www.kadaster.nl">Kadaster</a>.';
}

const wms_sound = "https://geodata.nationaalgeoregister.nl/rwsgeluidskaarten/ows?"
const sound = new L.tileLayer.wms(wms_sound, {
    layers: ['Lden_2016'],
    styles: '',
    crs: RD,
    format: 'image/png',
    transparent: true,
    attribution: '© <a href="http://www.rws.nl/"> Rijkswaterstaat</a>',
    pointerCursor: true,
});


const baseLayers = {
    "Topographical map": basemap_pdok,
    "Aerial photo": basemap_aerial,
    "AHN3": ahn3_pdok,
};

const overlays = {
    "Road noise": sound,
};

L.control.layers(baseLayers, overlays).addTo(map);

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
    onAdd: function(map) {
        let img = L.DomUtil.create('img');

        L.DomUtil.addClass(img, "icon-localization");

        return img;
    },

    onRemove: function(map){
        // Nothing to do here
    }
});

L.control.localization = function(opts) {
    return new L.Control.Localization(opts);
}

L.control.localization({ position: 'topleft'}).addTo(map);

$(".icon-localization").on("click", toggleLocalization);


// Handle GPS logging

let gpsOn = false;

function locateMe(e){
    if (gpsOn) {
        map.locate();
        setTimeout(locateMe, 1000);
    }
}

function toggleLocalization(e){
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