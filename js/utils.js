function copy(mainObj) {
    // https://scotch.io/bar-talk/copying-objects-in-javascript
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}


function flip(mainObj) {
    let outputObj = [];

    for (let i = 0; i < mainObj.length; i++) {
        outputObj.push([mainObj[i][1], mainObj[i][0]]);
    }

    return outputObj;
}