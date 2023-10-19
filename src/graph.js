const toolButtons = document.querySelectorAll('.tool-button');
const canvas = document.getElementById('mainCanvas');
const moveButton = document.getElementById('move');

let currentTool;
let nodeCount = 0;
let hoveredNode = null;
let selectedNode = null;
let graph = {}

// ####################################
// ########## TOOL SELECTING ##########
// ####################################

function activateButton(button){
    toolButtons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');
    
    const selectedTool = button.getAttribute('data-tool');
    currentTool = selectedTool;
    console.log(`Selected Tool: ${selectedTool}`);
}

toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        activateButton(button);
    });
});

// At the start activate the move button
activateButton(moveButton);


// ####################################
// ########### CREATE NODE ############
// ####################################

document.getElementById('mainCanvas').addEventListener("click", function (e) {
    if (currentTool === "createNode"){
        console.log("creating a node")
        const node = document.createElement("div");
        var x = e.pageX;
        var y = e.pageY;
        
        node.className = "node";
        
        node.style.left = x-30 + 'px';
        node.style.top = y-30 + 'px';
        
        const nodeText = document.createElement("h2");
        nodeID = getNextNodeID();
        nodeText.textContent = "q" + nodeID;
        node.appendChild(nodeText);
        
        node.addEventListener('click', nodeClick);
        node.addEventListener('mouseover', () => {hoveredNode = node})
        node.addEventListener('mouseout', () => {hoveredNode = null})
        
        graph[nodeID] = {}
        
        canvas.appendChild(node);
    }
});

// ####################################
// ########### DELETE NODE ############
// ####################################

function nodeClick(){
    if (currentTool === "delete" && this.classList.contains("node")){
        this.remove();
        nodeCount = getNextNodeID();
    }
}

function getNextNodeID(){
    let id = 0;
    while (isIdExist(id)){
        id++;
    }
    return id;
}

function isIdExist(id){
    const nodes = document.querySelectorAll('.node');
    let isFound = false;
    nodes.forEach(node => {
        const h2Child = node.querySelector('h2');
        const textContent = h2Child.textContent;
        const nodeID = parseInt(textContent.substring(1));
        if (id==nodeID){
            isFound = true
        } 
    })
    return isFound;
}

// ####################################
// ##### MOVE AND CONNECT TOOL ########
// ####################################

let isDragging = false;

document.getElementById('mainCanvas').addEventListener("mousedown", function (e) {
    if (hoveredNode != null){
        isDragging = true;
        if (currentTool === "moveNode"){
            offsetX = e.clientX - selectedNode.getBoundingClientRect().left;
            offsetY = e.clientY - selectedNode.getBoundingClientRect().top;
        }else if (currentTool === "connectNodes"){
            // Draw Arrow
        }
    }
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        if (currentTool === "moveNode"){
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
    
            // Ensure the element stays within the window boundaries
            newX = Math.max(0, Math.min(newX, window.innerWidth - selectedNode.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - selectedNode.offsetHeight));
    
            selectedNode.style.left = newX + "px";
            selectedNode.style.top = newY + "px";
        }
    }else {
        selectedNode = hoveredNode;
    }
});

document.addEventListener("mouseup", () => {
    if (isDragging){
        connectNodes(selectedNode, hoveredNode);
    }
    isDragging = false;
});

document.addEventListener("mouseleave", () => {
    if (isDragging){
        connectNodes(selectedNode, hoveredNode);
    }
    isDragging = false;
});

function connectNodes(node1, node2){
    console.log(node1.querySelector('h2').textContent + " -> " + node2.querySelector('h2').textContent)
}

// Connect 2 nodes:
// - check for drag
//    - if on the connect tool:
//      - if ends on a node other then the starting node
//          - ask for connection value
//             - connect 2 nodes
//      - if not, ask for connection value
//          - connect node to itself 