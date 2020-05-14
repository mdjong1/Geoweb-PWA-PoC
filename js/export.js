$("#geojson-export").on('click', exportTrackToGeoJson);

let geoJsonLineString = {
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

function exportTrackToGeoJson() {
    let exportJson = copy(geoJsonLineString);

    exportJson["features"][0]["geometry"]["coordinates"] = flip(gpsLocations);

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportJson));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');

    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", Date.now() + ".json");
    dlAnchorElem.click();

}
