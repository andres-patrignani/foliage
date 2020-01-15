// Foliage v 1.0
// Author: Andres Patrignani
// Date: 12-January-2020
// Contact e-mail: andrespatrignani@ksu.edu

let imgOriginal;
let imgCounter = 0;
var canvasDiv;
var table;
var thumbnail;
var percentCanopyCover;

var containerTable;
var resultsTable;
var btnDownload;
var btnDeleteTable;
var btnUploadLabel;
var heroBanner;
var progressBar;

var realtimeLatitude;
var latitude;
var latArray;
var latRef;

var realtimeLongitude;
var longitude;
var lonArray;
var lonRef;

var realtimeAltitude;
var altitude;
var altitudeRef;

var country;
var state;
var region;

var vegetationType;
var dateTime;

var imgOriginalsRef;
var imgClassifiedRef;
var storageRef;
var user;
var zip = new JSZip();
var originals = zip.folder("originals");
var classified = zip.folder("classified");
var JSONdata = [];

function setup() {
    // Print software version
    console.log('Running v1.0');

    // Remove default p5 canvas
    noCanvas()

    // Dropzone
    dropzone = select('body');
    dropzone.drop(gotFile);

    // Get table element
    resultsTable = document.getElementById('resultsTable');

    // Create table for storing images
    table = new p5.Table();
    table.addColumn('name');
    table.addColumn('vegetationType');
    table.addColumn('snapDate');
    table.addColumn('uploadDate');
    table.addColumn('latitude');
    table.addColumn('longitude');
    table.addColumn('altitude');
    table.addColumn('canopyCover');

    // Upload button
    btnUploadLabel = document.getElementById('btnUploadLabel');
    btnUploadLabel.setAttribute('disabled','')

    btnUpload = createFileInput(gotFile,'multiple');
    btnUpload.parent('btnUploadLabel');
    btnUpload.style('display','none');
    btnUpload.elt.disabled = true;
    btnUpload.type = 'file';
    btnUpload.accept = "image/*";
    btnUpload.capture = 'environment';

    // Hero banner
    heroBanner = document.getElementById("heroBanner");

    // Progress bar
    progressBar = document.getElementById('progressBar');

    // Download CSV button
    let downloadTimestamp = new Date();
    btnDownloadCSV = document.getElementById("btnDownloadCSV")
    btnDownloadCSV.style.visibility = 'hidden';
    btnDownloadCSV.addEventListener("click", function(){
        saveTable(table, 'metadata_' + downloadTimestamp.getTime() + '.csv'); // p5 Function
    });

    // Download Images button
    btnDownloadZIP = document.getElementById("btnDownloadZIP")
    btnDownloadZIP.style.visibility = 'hidden';
    btnDownloadZIP.addEventListener("click", function(){
        zip.file('data_' + downloadTimestamp.getTime() + '.json', JSON.stringify(JSONdata))
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            // need FileSaver.js
            //console.log(content)
            saveAs(content, 'Foliage_' + downloadTimestamp + '.zip');
        });
    });

    // Delete table button
    btnDeleteTable = document.getElementById('btnDeleteTable');
    btnDeleteTable.addEventListener('click', deleteTable)

    // Hide results table
    containerTable = document.getElementById('containerTable');
    containerTable.style.display = 'none';
}

function gotFile(file) {

    if(imgCounter <= 50){
        if (file.type === 'image'){
            loadImage(file.data,function(imgOriginal){

                // Get geographic coordinates
                getLocation()

                // Start counting images
                imgCounter += 1;

                // Make results table visible
                if (imgCounter === 1){
                    heroBanner.style.display = 'none';
                    containerTable.style.display = 'block';
                    btnDownloadCSV.style.visibility = 'visible';
                    btnDownloadZIP.style.visibility = 'visible';
                }
    
                let imgOriginalId = 'img-original' + imgCounter; // Needed to call EXIF data
                let imgClassifiedId = 'img-classified' + imgCounter; // Not needed, but added for consistency with imgOriginal
    
                // Generate Id for table cells
                let imgCounterCellId = 'img-counter-cell' + imgCounter;
                let imgOriginalCellId = 'img-original-cell' + imgCounter; //'img-container'+imgCounter;
                let imgClassifiedCellId = 'img-classified-cell' + imgCounter; //'img-container'+imgCounter;
                let vegetationTypeCellId = 'vegetation-type-cell' + imgCounter;
                let filenameCellId = 'filename-cell' + imgCounter;
                let canopyCoverCellId = 'canopy-cover-cell' + imgCounter;
                let latitudeCellId = 'latitude-cell' + imgCounter;
                let longitudeCellId = 'longitude-cell' + imgCounter;
                let altitudeCellId = 'altitude-cell' + imgCounter;
    
                // Create table row
                let tableRow = createElement('tr','<td '+ 'id="' + imgCounterCellId + '"' + '></td>' + '<td '+ 'id="' + imgOriginalCellId + '"' +'></td>'+'<td '+ 'id="' + imgClassifiedCellId + '"' +'></td>' + '<td class="is-hidden-mobile" '+ 'id="' + vegetationTypeCellId + '"' + '>' + '</td>' + '<td class="is-hidden-mobile" '+ 'id="' + filenameCellId + '"' + '></td>' + '<td '+ 'id="' + canopyCoverCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + latitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" ' + 'id="' + longitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + altitudeCellId + '"' + '></td>').parent('resultsTable');    
                //let tableRow = createElement('tr','<td '+ 'id="' + imgCounterCellId + '"' + '></td>' + '<td '+ 'id="' + imgOriginalCellId + '"' +'></td>'+'<td '+ 'id="' + imgClassifiedCellId + '"' +'></td>' + '<td class="is-hidden-mobile">' + '<textarea class="textarea" rows="1" id="' + vegetationTypeCellId + '"' + '></textarea>' + '</td>' + '<td class="is-hidden-mobile" '+ 'id="' + filenameCellId + '"' + '></td>' + '<td '+ 'id="' + canopyCoverCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + latitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" ' + 'id="' + longitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + altitudeCellId + '"' + '></td>').parent('resultsTable');    
                //testcell.parentElement.parentElement.cells[0].innerText

                // Get upload timestamp
                uploadDate = new Date();
                
                // Resize image so that the largest side has 1440 pixels
                if(imgOriginal.width>=imgOriginal.height){
                    imgOriginal.resize(1440,0); 
                } else {
                    imgOriginal.resize(0,1440);
                }
                imgOriginal.loadPixels();

                // Initiatve classified image
                imgClassified = createImage(imgOriginal.width,imgOriginal.height);
                imgClassified.loadPixels();
            
                // Classify image following manuscript settings
                let RGratio = 0.95;
                let RBratio = 0.95;
                let canopyCover = 0;
                for(let y=0; y<imgClassified.height; y++){
                    for(let x=0; x<imgClassified.width; x++){
                        let index = (x + y * imgClassified.width)*4;
                    
                        let R = float(imgOriginal.pixels[index+0]);
                        let G = float(imgOriginal.pixels[index+1]);
                        let B = float(imgOriginal.pixels[index+2]);
                    
                        if (R/G < RGratio && B/G < RBratio && 2*G-R-B>20){
                            imgClassified.pixels[index+0] = 255;
                            imgClassified.pixels[index+1] = 255;
                            imgClassified.pixels[index+2] = 255;
                            imgClassified.pixels[index+3] = 255;
                            canopyCover += 1;

                        } else {
                            imgClassified.pixels[index+0] = 0;
                            imgClassified.pixels[index+1] = 0;
                            imgClassified.pixels[index+2] = 0;
                            imgClassified.pixels[index+3] = 255;
                        }
                    }
                }
                imgClassified.updatePixels();
                percentCanopyCover = round(canopyCover/(imgClassified.width * imgClassified.height)*1000)/10;

                // Calculate aspect ratio for thumbnails and resize images
                var aspectRatio = imgClassified.width/imgClassified.height;
                
                // Thumbnail original image
                thumbnailOriginal = createImg(file.data);
                thumbnailOriginal.size(128*aspectRatio,128)
                thumbnailOriginal.id(imgOriginalId)
                thumbnailOriginal.parent(imgOriginalCellId)
                
                // Thumbnail classified image
                thumbnailClassified = createImg(imgClassified.canvas.toDataURL());
                thumbnailClassified.size(128*aspectRatio,128);
                thumbnailClassified.id(imgClassifiedId);
                thumbnailClassified.parent(imgClassifiedCellId);
                thumbnailClassified.style.border = "5px solid black;"

                EXIF.getData(document.getElementById(imgOriginalId), function() {
                    // var allMetaData = EXIF.getAllTags(this);
                    // console.log(JSON.stringify(allMetaData, null, "\t"));
                    snapDate = EXIF.getTag(this, "DateTime");
                    latArray = EXIF.getTag(this, "GPSLatitude");
                    latRef = EXIF.getTag(this, "GPSLatitudeRef")
                    lonArray = EXIF.getTag(this, "GPSLongitude");
                    lonRef = EXIF.getTag(this, "GPSLongitudeRef");
                    altitude = EXIF.getTag(this, "GPSAltitude");
                    altitudeRef = EXIF.getTag(this, "GPSAltitudeRef");
                });

                
                // Check EXIF dateTime
                if (typeof snapDate === 'undefined'){
                    snapDate = null;
                }

                // Check EXIF latitude
                if (typeof latArray === 'undefined'){
                    latitude = null;
                } else {
                    latitude = degreeToDecimal(latArray[0],latArray[1],latArray[2],latRef);
                }

                // Check EXIF longitude
                if (typeof lonArray === 'undefined'){
                    longitude = null;
                } else {
                    longitude = degreeToDecimal(lonArray[0],lonArray[1],lonArray[2],lonRef);
                }

                // Check EXIF altitude
                if (typeof altitude === 'undefined' || altitude === null){
                    altitude = null;
                } else {
                    altitude = altitudeToMeters(altitude, altitudeRef) ;
                }

                // Replace any null values with realtime GPS data. Only replace if null to avoid overwriting
                // EXIF data.
                // Check real time latitude
                // if (latitude === null){
                //     latitude = realtimeLatitude;
                // }

                // Check real time latitude
                // if (longitude === null){
                //     longitude = realtimeLongitude;
                // }
                
                // Check real time latitude
                // if (altitude === null){
                //     altitude = realtimeAltitude;
                // }

                // Update HTML table
                // document.getElementById(imgCounterCellId).innerText = imgCounter;
                // document.getElementById(vegetationTypeCellId).innerText = vegetationType;
                // document.getElementById(filenameCellId).innerText = file.name;
                // document.getElementById(canopyCoverCellId).innerText = percentCanopyCover;

                resultsTable.rows[imgCounter].cells[imgCounterCellId].innerText = imgCounter;
                resultsTable.rows[imgCounter].cells[vegetationTypeCellId].innerText = vegetationType;
                resultsTable.rows[imgCounter].cells[filenameCellId].innerText = file.name;
                resultsTable.rows[imgCounter].cells[canopyCoverCellId].innerText = percentCanopyCover;

                if(latitude === null){
                    resultsTable.rows[imgCounter].cells[latitudeCellId].innerHTML = 'Unknown';
                } else {
                    resultsTable.rows[imgCounter].cells[latitudeCellId].innerHTML = latitude;
                }

                if(longitude === null){
                    resultsTable.rows[imgCounter].cells[longitudeCellId].innerHTML = 'Unknown';
                } else {
                    resultsTable.rows[imgCounter].cells[longitudeCellId].innerHTML = longitude;
                }

                if(altitude === null){
                    resultsTable.rows[imgCounter].cells[altitudeCellId].innerHTML = 'Unknown';
                } else {
                    resultsTable.rows[imgCounter].cells[altitudeCellId].innerHTML = altitude;
                }

                
                // Append to output table
                var newRow = table.addRow();
                newRow.set('name', file.name);
                newRow.set('vegetationType', vegetationType);
                newRow.set('snapDate', snapDate);
                newRow.set('uploadDate', uploadDate.toString()); // For downloadable file write date on a human readable format
                newRow.set('latitude', latitude);
                newRow.set('longitude', longitude);
                newRow.set('altitude', altitude);
                newRow.set('canopyCover', percentCanopyCover);

                var imgName = 'img_' + uploadDate.getTime();
                JSONdata.push({
                    name: imgName,
                    snapDate: snapDate,
                    uploadDate: uploadDate.getTime(),
                    latitude: latitude,
                    longitude: longitude,
                    altitude: altitude,
                    cover: percentCanopyCover,
                    vegetationType: vegetationType,
                    country: country,
                    state: state,
                    region: region
                });
                
                // Add original and classified images to ZIP file
                originals.file(imgName + '.jpg', dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg')), {base64: true});
                classified.file(imgName + '.jpg', dataURItoBlob(imgClassified.canvas.toDataURL('image/jpeg')), {base64: true});
            });
        }
    }
}

function deleteTable(){
    containerTable.remove();
    heroBanner.style.display = 'flex';
}


function degreeToDecimal(D,M,S,ref) {
    let decimal = Math.round( (D + M/60 + S/3600) * 1000000 )/ 1000000;
    if (ref === 'W' || ref === 'S'){
        decimal = decimal * -1;
    }
    return decimal;
}

function altitudeToMeters(value, ref) {
    let meters;
    if(ref === 1){
        value = value * -1;
    }
    meters = Math.round(value);
    return meters;
}

function dataURItoBlob(dataURI) {
    // Found this solution at: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

function getVegetationType(){
    if(document.getElementById('vegetationTypeList') !== null){
        vegetationType = document.getElementById('vegetationTypeList').value;
        if(vegetationType !== 'empty'){
            btnUpload.elt.disabled = false;
            btnUploadLabel.removeAttribute('disabled','')
            //document.getElementById('vegetationTypeRequireMsg').innerHTML = '';
        } else {
            btnUploadLabel.setAttribute('disabled','')
            btnUpload.elt.disabled = true;
            //document.getElementById('vegetationTypeRequireMsg').innerHTML = 'Required field';
        }
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(realtimePosition);
    } else {
        realtimeLatitude = null;
        realtimeLongitude = null;
        realtimeAltitude = null;
        country = null;
        state = null;
        region = null;
        console.log('Navigator not available')
    }
}

function realtimePosition(position) {
   realtimeLatitude =  position.coords.latitude;
   realtimeLongitude = position.coords.longitude; 
   realtimeAltitude = position.coords.altitude;
}

function getLocationInitial(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(realtimePositionInitial);
    }
}

function realtimePositionInitial(position) {
    getAddress(position.coords.latitude, position.coords.longitude)
}

getLocationInitial()


function getAddress(lat,lon) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&' + 'lon=' + lon;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            //console.log(JSON.stringify(jsonData));

            // Country
            if ('country' in jsonData.address){
                country = jsonData.address.country;
            } else {
                country = null;
            }
        
            // State
            if ('state' in jsonData.address){
                state = jsonData.address.state;
            } else {
                state = null;
            }
        
            // Region (this entry is not the same for different parts of the world)
            if ('state_district' in jsonData.address){
                region = jsonData.address.state_district;
            } else if ('county' in jsonData.address) {
                region = jsonData.address.county;
            } else {
                region = null;
            }
            console.log(country)
        });
}


// Get the modal
var aboutModal = document.getElementById("aboutModal");

// Get the button that opens the modal
var openAboutModalBtn = document.getElementById('openAboutModalBtn');

// Get the <span> element that closes the modal
var closeAboutModalBtn = document.getElementById('closeAboutModal');

// When the user clicks on the button, open the modal
openAboutModalBtn.addEventListener('click', function (){
    aboutModal.classList.add('is-active')
})

// When the user clicks on <span> (x), close the modal
closeAboutModalBtn.addEventListener('click', function (){
    aboutModal.classList.remove('is-active')

})