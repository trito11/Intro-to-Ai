let graph = createGraph();

// Detect listNode data (lat, lng) to (x, y)
const listNodeDetected = listNode.map((item) => {
    return { x: item.lat, y: item.lng };
});

// Add node and link to graph
listNodeDetected.forEach((item, index) => graph.addNode(`${index + 1}`, item));
for (const [key, value] of Object.entries(listLink)) {
    value.forEach((item) => graph.addLink(`${key}`, `${item}`));
}

// Main function find path
function findPathAstar(start, end) {
    startDetected = detectPosition(start);
    endDetected = detectPosition(end);
    startNode = findNearestNode(startDetected);
    endNode = findNearestNode(endDetected);

    // Find path by astar
    let pathFinder = ngraphPath.aStar(graph, {
        distance(fromNode, toNode) {
            let dx = fromNode.data.x - toNode.data.x;
            let dy = fromNode.data.y - toNode.data.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
    });

    const route = pathFinder.find(startNode.id, endNode.id);
    const resultPath = route.reverse().map((item) => {
        return { lat: item.data.x, lng: item.data.y };
    });
    resultPath.push(end);
    resultPath.unshift(start);

    console.log(route[1].id)
    console.log(resultPath)

    return resultPath;

    // return optimizeResult(resultPath);
}

function findPathDijkstra(start, end) {
    startDetected = detectPosition(start);
    endDetected = detectPosition(end);
    startNodeId = findNearestNode(startDetected).id;
    endNodeId = findNearestNode(endDetected).id;

    let allNodes = {}, allEdges = {};

    graph.forEachNode((node) => {
        allNodes= {...allNodes, [node.id]: {x: node.data.x, y: node.data.y}}
    });

    graph.forEachLink((link) => {
        const { fromId, toId } = link;
        if(allEdges[fromId])
            allEdges[fromId].push(toId);
        else
            allEdges = {...allEdges, [fromId]: [toId]}

        if(allEdges[toId])
            allEdges[toId].push(fromId);
        else
            allEdges = {...allEdges, [toId]: [fromId]}
    });

    function dijkstra(allNodes, allEdges, startNodeId) {
        // Set initial distances to Infinity for all nodes except the start node
        const distances = {};
        for (let node in allNodes) {
            distances[node] = Infinity;
        }
        distances[startNodeId] = 0;
      
        // Track the shortest path from startNode to each node
        const shortestPath = {};
      
        // Track visited nodes
        const visited = [];
        
        function Distances(id1, id2) {
            let node1 = allNodes[id1]
            let node2 = allNodes[id2]
            return Math.pow(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2), 0.5)
        }
        while (Object.keys(visited).length !== Object.keys(allNodes).length) {
            let smallestNode = null;
        
            // Find the node with f smallest distance from f startNode
            for (let node in allNodes) {
                
                if (!visited.includes(node) && (smallestNode === null || distances[node] < distances[smallestNode])) {
                    smallestNode = node;
                }
            }
            
            // If there is no smallestNode, then we are done
            if (smallestNode === null) {
                break;
            }
            
            // Mark f smallestNode as visited
            visited.push(smallestNode);
    
            // Update distances to neighboring nodes
            for (let i=0; i<allEdges[smallestNode].length; i++) {
                let neighbor = allEdges[smallestNode][i]
                let distance = Distances(smallestNode, neighbor);
                let totalDistance = distances[smallestNode] + distance;
        
                if (totalDistance < distances[neighbor]) {
                    distances[neighbor] = totalDistance;
                    shortestPath[neighbor] = smallestNode;
                }
            }
        }
      
        return { distances, shortestPath };
    }
    
    let routeId = []

    let shortestPath = dijkstra(allNodes, allEdges, startNodeId).shortestPath
    while(startNodeId != endNodeId) {
        routeId.push(endNodeId)
        endNodeId = shortestPath[endNodeId]   
    }
    routeId.push(startNodeId)

    allNodes = [];

    graph.forEachNode((node) => {
        allNodes.push({id: node.id, data: {x: node.data.x, y: node.data.y}});
    });

    let route = []

    for(let i=0; i<routeId.length; i++)
        route.push(allNodes[routeId[i] - 1]);

    console.log(route, routeId, allEdges)
    const resultPath = route.map((item) => {
        return { lat: item.data.x, lng: item.data.y };
    });
    // resultPath.push(end);
    // resultPath.unshift(start);

    // console.log(route[1].id)
    // console.log(resultPath)

    return resultPath;
}


// Detect position (x, y) from (lat, lng)
function detectPosition(position) {
    return { x: position.lat, y: position.lng };
}

// Find nearest node to a node
function findNearestNode(nodeFind) {
    let minDistance = 0;
    let foundNode;
    graph.forEachNode(function(node) {
        distance = calculateDistance(node.data, nodeFind);
        if (minDistance === 0 || distance < minDistance) {
            minDistance = distance;
            foundNode = node;
        }
    });

    return foundNode;
}


// Calculate distance between two node
function calculateDistance(fromNode, toNode) {
    let dx = fromNode.x ? fromNode.x - toNode.x : fromNode.lat - toNode.lat;
    let dy = fromNode.y ? fromNode.y - toNode.y : fromNode.lng - toNode.lng;

    return Math.sqrt(dx * dx + dy * dy);
}