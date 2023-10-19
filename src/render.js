const toolButtons = document.querySelectorAll('.tool-button');
const canvas = document.getElementById('mainCanvas');
const moveButton = document.getElementById('move');
let currentTool;
let nodeCount = 0;

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

//Check for click:
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
        nodeText.textContent = "q" + nodeCount;
        nodeCount++;
        node.appendChild(nodeText);

        node.addEventListener('click', nodeClick);
        makeElementDraggable(node);


        canvas.appendChild(node);
    }
});

function nodeClick(){
    if (currentTool === "delete" && this.classList.contains("node")){
        nodeCount
        this.remove();
    }
}

// Drag-and-Drop
function makeElementDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", (e) => {
        if (currentTool=="moveNode"){
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Ensure the element stays within the window boundaries
            newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
            newY = Math.max(60, Math.min(newY, window.innerHeight - element.offsetHeight));

            element.style.left = newX + "px";
            element.style.top = newY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mouseleave", () => {
        isDragging = false;
    });
}