var config = {
    apiKey: "AIzaSyAdVcNf7qD6xYm5VGAJS3qOJ-5hodXiTTY",
    authDomain: "canopeo-62727.firebaseapp.com",
    databaseURL: "https://canopeo-62727.firebaseio.com",
    projectId: "canopeo-62727",
    storageBucket: "canopeo-62727.appspot.com",
    messagingSenderId: "304996425996"
  };
firebase.initializeApp(config);

// Get data from public database
publicMetadataRef = firebase.database().ref('publicMetadata');
publicMetadataRef.limitToLast(10).once('value', gotFirebaseMetadata, errFirebaseData);

// Display Leaflet map
map = L.map('mapid').setView([0, 0], 2);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZmllbGRjYXN0ZXIiLCJhIjoiY2pnbGt5MDNjMDNuNTJ3bzFiem1mb21ydSJ9.rJ6-prcDE5zDOXsC7Tjfwg' // Public read-only token
}).addTo(map);

function gotFirebaseMetadata(data){
    var recentUploads = data.val();
    //console.log(recentUploads)
    var keys = Object.keys(recentUploads);

    for(let i = 0; i < keys.length; i++){
        var k = keys[i];
        let latPoint = recentUploads[k].latitude;
        let lonPoint = recentUploads[k].longitude;
        if (latPoint !== undefined && lonPoint !== undefined){
            marker = new L.marker([latPoint,lonPoint])
            .bindPopup('<b>Vegetation type: </b>' + recentUploads[k].vegetationType + '<br/>' + '<b>Green canopy cover: </b>' + recentUploads[k].cover + ' %' + '<br/>' + '<b>Image taken on </b>' + recentUploads[k].snapDate + '<br/>' + '<b>Country: </b>' + recentUploads[k].country + '<br/>' + '<b>State: </b>' + recentUploads[k].state + '<br/>' + '<b>Region: </b>' + recentUploads[k].region)
            .addTo(map);
        }
    }
}

function errFirebaseData(err) {
    console.log('Error requesting data from Firebase');
    console.log(err);
}


