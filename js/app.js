let map, start, end, route;
let choosePoint = "start";
let markers = [];
let markerStart = [];
let markerEnd = [];
let pointStart = null;
let pointEnd = null;
let allNodeMarkers = [];
const geofenceColor = "#b4ffb6";
const pathColor = "red";


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: centerNode,
        zoom: 17,
    });

    const geocoder = new google.maps.Geocoder();
    const infowindowStart = new google.maps.InfoWindow();
    const infowindowEnd = new google.maps.InfoWindow();

    // Construct the geofence
    const geofence = new google.maps.Polygon({
        paths: listNodeGeofence,
        strokeColor: geofenceColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: geofenceColor,
        fillOpacity: 0.2,
    });
    geofence.setMap(map);

    // const trafficLayer = new google.maps.TrafficLayer();
    // trafficLayer.setMap(map);


    // Click geofence
    geofence.addListener("click", (geofenceMouseClick) => {
        if (allNodeMarkers.length !== 0) {
            siiimpleToast.alert("Must hide all buttons", { duration: 3000 });
            return;
        }
        if (choosePoint === "start") {
            if (route) {
                removePath();
                clearPathMarker();
            }
            start = geofenceMouseClick.latLng.toJSON();
            pointStart = start;
            choosePoint = "end";
            createMarker(start, "S");
            if (markerStart.length === 0) {
                const marker = new google.maps.Marker({
                    position: start,
                    map,
                    label: {
                        text: "S",
                        color: "white",
                    },
                });
                markerStart.push(marker)
            } else {
                markerStart[0].setMap(null)
                markerEnd[0].setMap(null)
                markerStart = []
                markerEnd = []
                pointEnd = null
                const marker = new google.maps.Marker({
                    position: start,
                    map,
                    label: {
                        text: "S",
                        color: "white",
                    },
                });
                markerStart.push(marker)
            }
        } else if (choosePoint === "end") {
            end = geofenceMouseClick.latLng.toJSON();
            pointEnd = end;
            choosePoint = "start";
            createMarker(end, "Đ");
            if (markerEnd.length === 0) {
                const marker = new google.maps.Marker({
                    position: end,
                    map,
                    label: {
                        text: "E",
                        color: "yellow"
                    }
                });
                markerEnd.push(marker)
            } else {
                if (allNodePassed.length !== 0) {
                    for (let i = 0; i < node_passed.length; i++) {
                        allNodePassed[i].setMap(null);
                    }
                }
                allNodePassed = [];
                markerEnd[0].setMap(null)
                markerEnd = []
                const marker = new google.maps.Marker({
                    position: end,
                    map,
                    label: {
                        text: "E",
                        color: "yellow"
                    }
                });
                markerEnd.push(marker)
            }

        }
    });


    // Create marker
    function createMarker(position, label = "") {
        geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    const marker = new google.maps.Marker({
                        position: position,
                        map,
                        label: label,
                    });
                    if (label === "S") {
                        markers[0] = marker;
                        infowindowStart.setContent(results[0].formatted_address);
                        infowindowStart.open(map, marker);
                    } else if (label === "E") {
                        markers[1] = marker;
                        infowindowEnd.setContent(results[0].formatted_address);
                        infowindowEnd.open(map, marker);
                    }
                }
            }
        });
    }

    function clearPathMarker() {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    // Draw path
    function drawPath(path) {
        route = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: pathColor,
            strokeOpacity: 1.0,
            strokeWeight: 4,
        });

        route.setMap(map);
    }

    // Remove path
    function removePath() {
        if (route) route.setMap(null);
    }

    // Click outside
    map.addListener("click", () => {
        siiimpleToast.alert("Please choose in Nguyen Du area");
    });



    // Show all node
    document.querySelector("#btn-display").addEventListener("click", () => {
        clearPathMarker();
        choosePoint = "start";
        if (allNodeMarkers.length === 0) {
            for (let i = 0; i < listNode.length; i++) {
                const marker = new google.maps.Marker({
                    position: listNode[i],
                    map,
                    label: `${i + 1}`,
                });
                allNodeMarkers.push(marker);
            }
            siiimpleToast.message(`Show all ${listNode.length} node`, { duration: 3000 });
            document.querySelector("#btn-display-text").innerHTML = "Hide all nodes";
        } else {
            for (let i = 0; i < allNodeMarkers.length; i++) {
                allNodeMarkers[i].setMap(null);
            }
            allNodeMarkers = [];
            siiimpleToast.message(`Hide all ${listNode.length} node`, { duration: 3000 });
            document.querySelector("#btn-display-text").innerHTML = "Show all nodes";
        }
    });


    // Search path
    document.querySelector("#btn-search-path").addEventListener("click", () => {
        document.querySelector('#btn-search-path-astar').style.display = 'inline-block'
        document.querySelector('#btn-search-path-xxx').style.display = 'inline-block'
    })
    document.querySelector("#btn-search-path-astar").addEventListener("click", () => {
        if (pointEnd !== null && pointStart !== null) {
            const path = findPathAstar(pointStart, pointEnd);
            node_passed = path;
            drawPath(path);
            siiimpleToast.success(`Suggest passing ${path.length - 2} Node`, {
                duration: 4000,
            });
            pointStart = null
            pointEnd = null
        } else {
            siiimpleToast.alert("Choose two points before finding your way", { duration: 4000 })
        }
    })
}