// Dijkstra's Algorithm
function dijkstra(graph, startNode) {
    // Set initial distances to Infinity for all nodes except the start node
    const distances = {};
    for (let node in graph) {
      distances[node] = Infinity;
    }
    distances[startNode] = 0;
  
    // Track the shortest path from startNode to each node
    const shortestPath = {};
  
    // Track visited nodes
    const visited = [];
  
    while (Object.keys(visited).length !== Object.keys(graph).length) {
      let smallestNode = null;
  
      // Find the node with the smallest distance from the startNode
      for (let node in graph) {
        if (!visited.includes(node) && (smallestNode === null || distances[node] < distances[smallestNode])) {
          smallestNode = node;
        }
      }
  
      // If there is no smallestNode, then we are done
      if (smallestNode === null) {
        break;
      }
  
      // Mark the smallestNode as visited
      visited.push(smallestNode);
  
      // Update distances to neighboring nodes
      for (let neighbor in graph[smallestNode]) {
        let distance = graph[smallestNode][neighbor];
        let totalDistance = distances[smallestNode] + distance;
  
        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          shortestPath[neighbor] = smallestNode;
        }
      }
    }
  
    return { distances, shortestPath };
  }
  
  // Example usage
  const graph = {
    A: { B: 5, C: 2 },
    B: { A: 5, C: 1, D: 3 },
    C: { A: 2, B: 1, D: 2 },
    D: { B: 3, C: 2, E: 4 },
    E: { D: 4 }
  };
  
  const startNode = 'A';
  const { distances, shortestPath } = dijkstra(graph, startNode);
  
  console.log('Distances:', distances);
  console.log('Shortest Path:', shortestPath);