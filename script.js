const toolButtons = document.querySelectorAll('.tool-button');
const canvas = document.getElementById('mainCanvas');
const moveButton = document.getElementById('move');
let currentTool;
let nodeCount = 0;

let hoveredNode = null;

let graph = {}

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

activateButton(moveButton);

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
        makeElementDraggable(node);

        graph[nodeID] = {}

        canvas.appendChild(node);
    }
});

function nodeClick(){
    if (currentTool === "delete" && this.classList.contains("node")){
        this.remove();
        nodeCount = getNextNodeID();
    }
}