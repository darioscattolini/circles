/************* CORE PROGRAM *************/

class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

class Circle {
    constructor(center, radius) {
        this._center = center;
        this._radius = radius;
    }

    get center() {
        return this._center;
    }

    get radius() {
        return this._radius;
    }

    distanceToCenterOf(anotherCircle) {
        return Math.hypot(
            this._center.x - anotherCircle.center.x, this._center.y - anotherCircle.center.y
        );
    }

    sameAs(anotherCircle) {
        return (
            this._center.x === anotherCircle.center.x &&
            this._center.y === anotherCircle.center.y &&
            this._radius === anotherCircle.radius
        );
    }

    isConcentric(anotherCircle) {
        return (
            this._center.x === anotherCircle.center.x &&
            this._center.y === anotherCircle.center.y
        );
    }

    sameRadiusAs(anotherCircle) {
        return this._radius === anotherCircle.radius;
    }

    isTangent(anotherCircle) {
        return (
            this.distanceToCenterOf(anotherCircle) === this._radius + anotherCircle.radius ||
            this.distanceToCenterOf(anotherCircle) === Math.abs(this._radius - anotherCircle.radius)
        );
    }

    isSecant(anotherCircle) {
        return (
            this.distanceToCenterOf(anotherCircle) > Math.abs(this._radius - anotherCircle.radius) &&
            this.distanceToCenterOf(anotherCircle) < this._radius + anotherCircle.radius
        );
    }

    doesNotTouch(anotherCircle) {
        return (!this.isTangent(anotherCircle) && !this.isSecant(anotherCircle));
    }
}

/* Builds 2 circles with data introduced by user and displays relationships */
document.getElementById("button").onclick = () => {
    const x1 = parseInt(document.getElementById("x1").value),
          y1 = parseInt(document.getElementById("y1").value),
          r1 = parseInt(document.getElementById("r1").value),
          x2 = parseInt(document.getElementById("x2").value),
          y2 = parseInt(document.getElementById("y2").value),
          r2 = parseInt(document.getElementById("r2").value);
    
    const center1 = new Point(x1, y1),
          center2 = new Point(x2, y2),
          circle1 = new Circle(center1, r1),
          circle2 = new Circle(center2, r2);
    
    document.getElementById("text").innerHTML =
        `<p>The distance between centers is ${circle1.distanceToCenterOf(circle2)}.</p>
        <p>The circles are ${circle1.sameAs(circle2) ? "" : "not "}equal.</p>
        <p>The circles are ${circle1.isConcentric(circle2) ? "" : "not "}concentric.</p>
        <p>The circles have ${circle1.sameRadiusAs(circle2) ? "" : "not "}equal radii.</p>
        <p>The circles are ${circle1.isTangent(circle2) ? "" : "not "}tangent.</p>
        <p>The circles are ${circle1.isSecant(circle2) ? "" : "not "}secant.</p>
        <p>The circumferences ${circle1.doesNotTouch(circle2) ? "do not " : ""}touch each other.</p>`;
    
    drawCanvas(x1, y1, r1, x2, y2, r2);
}

/********** DRAWING OF CIRCLES IN CANVAS **********/

/* GLOBAL VARIABLES */
const Canvas   = document.getElementById('graph'),
      Width    = Canvas.width,                     
      Height   = Canvas.height,
      Boundary = [];            //boundary of cartesian plane

let context;                    //canvas context

/* Function that governs the whole drawing process */
const drawCanvas = (x1, y1, r1, x2, y2, r2) => {
    
    calcBoundary(x1, y1, r1, x2, y2, r2);

    if (Canvas.getContext) {
            // Set up canvas
        context = Canvas.getContext('2d');
        context.clearRect(0, 0, Width, Height);
     
            // Draw content
        drawAxes();
        renderCircles(x1, y1, r1, x2, y2, r2);
    }
}

/* Calculates boundaries of cartesian plane */
const calcBoundary = (x1, y1, r1, x2, y2, r2) => {    

        // Boundaries required by circles
    const leftBoundary   = Math.abs(Math.min(x1 - r1, x2 - r2)),
          rightBoundary  = Math.abs(Math.max(x1 + r1, x2 + r2)),
          topBoundary    = Math.abs(Math.min(y1 - r1, y2 - r2)),
          bottomBoundary = Math.abs(Math.max(y1 + r1, y2 + r2));
    
        // Maximum value chosen in order to draw a symmetrical plane
        // +1 to add padding between circles and boundary
    const maxBoundary = Math.max(leftBoundary, rightBoundary, topBoundary, bottomBoundary) + 1;
    
        // Boundary array filled with four boundaries of cartesian plane
    Boundary[0] = -maxBoundary;
    Boundary[1] = maxBoundary;
    Boundary[2] = -maxBoundary;
    Boundary[3] = maxBoundary;
}

/* Functions that transform cartesian coordinates into canvas context coordinates */
const canvasX = x => {
    return (x - Boundary[0]) / (Boundary[1] - Boundary[0]) * Width;
}
const canvasY = y => {
    return Height - (y - Boundary[2]) / (Boundary[3] - Boundary[2]) * Height;
}
const canvasRadius = r => {
    return r * Width / (Boundary[1] - Boundary[0]);
}

/* Draws cartesian axes in canvas */
const drawAxes = () => {
    context.save();
    context.lineWidth = 2;
    
        // +Y axis
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(0), canvasY(Boundary[3]));
    context.stroke();

        // -Y axis
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(0), canvasY(Boundary[2]));
    context.stroke();

        // Y axis ruler
    for (var i = 1; i < Boundary[3]; ++i) {
        context.beginPath();
        context.moveTo(canvasX(0) - 5, canvasY(i));
        context.lineTo(canvasX(0) + 5, canvasY(i));
        context.stroke();
    }

    for (var i = 1; i > Boundary[2]; --i) {
        context.beginPath();
        context.moveTo(canvasX(0) - 5, canvasY(i));
        context.lineTo(canvasX(0) + 5, canvasY(i));
        context.stroke();
    }

        // +X axis
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(Boundary[1]), canvasY(0));
    context.stroke();

        // -X axis
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(Boundary[0]), canvasY(0));
    context.stroke();

        // X axis ruler
    for (var i = 1; i < Boundary[1]; ++i) {
        context.beginPath();
        context.moveTo(canvasX(i), canvasY(0) - 5);
        context.lineTo(canvasX(i), canvasY(0) + 5);
        context.stroke();
    }

    for (var i = 1; i > Boundary[0]; --i) {
        context.beginPath();
        context.moveTo(canvasX(i), canvasY(0) - 5);
        context.lineTo(canvasX(i), canvasY(0) + 5);
        context.stroke();
    }

    context.restore();
}

/* Draws both circles */
const renderCircles = (x1, y1, r1, x2, y2, r2) => {
    context.beginPath();
    context.arc(canvasX(x1), canvasY(y1), canvasRadius(r1), 0, 2 * Math.PI);
    context.stroke();

    context.beginPath();
    context.arc(canvasX(x2), canvasY(y2), canvasRadius(r2), 0, 2 * Math.PI);
    context.stroke();
}