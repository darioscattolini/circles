/********** PROGRAMA BÁSICO **********/

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
        `The distance between centers is ${circle1.distanceToCenterOf(circle2)}.<br>
        The circles are ${circle1.sameAs(circle2) ? "" : "not "}equal.<br>
        The circles are ${circle1.isConcentric(circle2) ? "" : "not "}concentric.<br>
        The circles have ${circle1.sameRadiusAs(circle2) ? "" : "not "}equal radii.<br>
        The circles are ${circle1.isTangent(circle2) ? "" : "not "}tangent.<br>
        The circles are ${circle1.isSecant(circle2) ? "" : "not "}secant.<br>
        The circumferences ${circle1.doesNotTouch(circle2) ? "do not " : ""}touch each other.<br>`;
    
    drawCanvas(x1, y1, r1, x2, y2, r2);
}

/********** DIBUJO DE LOS CÍRCULOS EN CANVAS **********/

/* VARIABLES GLOBALES PARA DIBUJAR EN CANVAS */
const Canvas   = document.getElementById('graph'),
      Width    = Canvas.width,
      Height   = Canvas.height,
      Boundary = [];

let context;

/* FUNCIÓN PRINCIPAL QUE CONTROLA TODO EL PROCESO DE DIBUJO*/
const drawCanvas = (x1, y1, r1, x2, y2, r2) => {
    // Calcula los límites del plano cartesiano
    calcBoundary(x1, y1, r1, x2, y2, r2);

    if (Canvas.getContext) {
        // Arma el canvas:
        context = Canvas.getContext('2d');
        context.clearRect(0, 0, Width, Height);
     
        // Dibuja el contenido:
        drawAxes();
        renderCircles(x1, y1, r1, x2, y2, r2);
    }
}

/* Función que calcula los límites del plano cartesiano */
const calcBoundary = (x1, y1, r1, x2, y2, r2) => {    
    // Extremos del plano requeridos por los círculos
    const leftBoundary   = Math.abs(Math.min(x1 - r1, x2 - r2)),
          rightBoundary  = Math.abs(Math.max(x1 + r1, x2 + r2)),
          topBoundary    = Math.abs(Math.min(y1 - r1, y2 - r2)),
          bottomBoundary = Math.abs(Math.max(y1 + r1, y2 + r2));
    
    // Se elije el máximo valor para el límite exterior para dibujar un plano simétrico
    // Se le suma 1 para dejar un padding entre los círculos y el borde del plano
    const maxBoundary = Math.max(leftBoundary, rightBoundary, topBoundary, bottomBoundary) + 1;
    
    // Se llena el array Boundary con los cuatro límites del plano cartesiano
    Boundary[0] = -maxBoundary;
    Boundary[1] = maxBoundary;
    Boundary[2] = -maxBoundary;
    Boundary[3] = maxBoundary;
}

/* Funciones que convierten las posiciones cartesianas a coordenadas de canvas */
const canvasX = x => {
    return (x - Boundary[0]) / (Boundary[1] - Boundary[0]) * Width;
}
const canvasY = y => {
    return Height - (y - Boundary[2]) / (Boundary[3] - Boundary[2]) * Height;
}
const canvasRadius = r => {
    return r * Width / (Boundary[1] - Boundary[0]);
}

/* Función que dibuja el plano cartesiano en canvas */
const drawAxes = () => {
    context.save();
    context.lineWidth = 2;
    
    // Eje +Y
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(0), canvasY(Boundary[3]));
    context.stroke();

    // Eje -Y
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(0), canvasY(Boundary[2]));
    context.stroke();

    // Marcas en el eje Y
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

    // Eje +X
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(Boundary[1]), canvasY(0));
    context.stroke();

    // Eje -X
    context.beginPath();
    context.moveTo(canvasX(0), canvasY(0));
    context.lineTo(canvasX(Boundary[0]), canvasY(0));
    context.stroke();

    // Marcas en el eje X
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

/* Función que dibuja los dos círculos */
const renderCircles = (x1, y1, r1, x2, y2, r2) => {
    context.beginPath();
    context.arc(canvasX(x1), canvasY(y1), canvasRadius(r1), 0, 2 * Math.PI);
    context.stroke();

    context.beginPath();
    context.arc(canvasX(x2), canvasY(y2), canvasRadius(r2), 0, 2 * Math.PI);
    context.stroke();
}