$("#geojson-export").on('click', exportTrackToGeoJson);
$("#kml-export").on('click', exportTrackToKml);

const geoJsonLineString = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        }
    ]
}

function getTrackAsGeoJson() {
    let exportJson = copy(geoJsonLineString);
    exportJson["features"][0]["geometry"]["coordinates"] = flip(gpsLocations);

    return exportJson;
}

function exportTrackToGeoJson() {
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getTrackAsGeoJson()));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');

    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", Date.now() + ".json");
    dlAnchorElem.click();
}

function exportTrackToKml() {
    let dataStr = "data:application/xml;charset=utf-8," + encodeURIComponent(tokml(getTrackAsGeoJson()));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');

    console.log(dataStr);

    dlAnchorElem.setAttribute("href", "data:" + dataStr);
    dlAnchorElem.setAttribute("download", Date.now() + ".xml");
    dlAnchorElem.click();
}
