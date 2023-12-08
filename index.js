let map = map_build(id='map')
let algorithm = document.getElementById('algorithm').value;
let mandatory = parseInt(document.getElementById('mandatory-point').value);
clickMAX = mandatory + 2;

handleMapClick(map)
document.getElementById('show-map').addEventListener("click", () => showMap(map))
document.getElementById('mandatory-point').addEventListener("change", () => reset(map))
document.getElementById('run').addEventListener("click", () => {
    initGraph();
    algorithm = document.getElementById('algorithm').value;

    const start = Date.now();

    let { distance, path } = 
        (parseInt(algorithm) === 0) ?   { distance: null, path: null } :
        (parseInt(algorithm) === 1) ?   Floyd_Warshall() : 
        (parseInt(algorithm) === 2) ?   { distance: null, path: null } :
                                        { distance: null, path: null } ;
    const end = Date.now();

    console.log('time: ', end - start, 'ms')
    console.log('path: ', path);
    console.log('distance: ', distance);

    showPath(path, true);
})