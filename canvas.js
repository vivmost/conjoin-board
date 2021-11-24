// capture canvas and set height and width
let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight
canvas.width = window.innerWidth;

let pencilColorElem = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

// Tool api
let tool = canvas.getContext("2d");

// default styling
let pencilColor = "black";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let oldColor;

// undo & redo --> graphic data and tracker
let undoRedoTracker = [];
let track = 0;

// draw graphic according to mouse movement 
let mouseDown = false;
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    beginPath({
        x: e.clientX,
        y: e.clientY
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        drawStroke({
            x: e.clientX,
            y: e.clientY
        });
    }
});

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// undo 
undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
});

// redo 
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
});

// screen change to reflect (redo and undo) changes
function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// accessing colors for pencil
pencilColorElem.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        tool.strokeStyle = color;
        oldColor = color;
    });
});

// accessing pencil width 
pencilWidthElem.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
});

// eraser functionality
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = oldColor;
        tool.lineWidth = pencilWidth;
    }
});

// accessing eraser width 
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
});

// download screenshot
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});