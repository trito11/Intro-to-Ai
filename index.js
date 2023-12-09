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

    const start = window.performance.now();

    let { distance, path } = 
        (parseInt(algorithm) === 0) ?   Floyd_Warshall() :
        (parseInt(algorithm) === 1) ?   Dijkstra() : 
        (parseInt(algorithm) === 2) ?   A_Star() :
                                        { distance: null, path: null } ;
    const end = window.performance.now();

    console.log('time: ', end - start, 'ms')
    console.log('path: ', path);
    console.log('distance: ', distance);

    if(distance < 9)
        showPath(path, true);
})