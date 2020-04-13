interface Point {
  x: number;
  y: number;
  dx: number;
  dy: number;
  d: number;
}

const random_range = (a: number, b: number) => {
  const plus = Math.floor(Math.random() * (b - a + 1));
  return a + plus;
};

const random_range_float = (a: number, b: number) => {
  const plus = Math.random() * (b - a);
  return a + plus;
};

const dist = (a: Point, b: Point): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export default function sketch(p: any) {
  let points: Point[] = [];

  const NUM_OF_POINTS = 100;

  function init() {
    points = [];
    for (let i = 0; i < NUM_OF_POINTS; i++) {
      const x = random_range_float(0, p.windowWidth);
      const y = random_range_float(0, p.windowHeight);
      const dx = random_range_float(-1, 1);
      const dy = random_range_float(-1, 1);
      const d = random_range(5, 10);
      const point: Point = {
        x,
        y,
        dx,
        dy,
        d,
      };
      points.push(point);
    }
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.smooth();
    init();
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props: any) {};

  p.draw = function () {
    const MIN_LINE_DIST = 80;

    p.clear();
    p.background(0, 0, 0);

    p.push();
    p.stroke(`rgba(255, 20, 147, ${1})`);
    p.strokeWeight(1);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const calcedDist = dist(points[i], points[j]);
        if (calcedDist < MIN_LINE_DIST) {
          p.line(points[i].x, points[i].y, points[j].x, points[j].y);
        }
      }
    }
    p.pop();

    p.push();
    p.noStroke();
    p.fill(255);
    for (let point of points) {
      if (point.x + point.dx <= 0 || point.x + point.dx >= p.windowWidth) {
        point.dx = -point.dx;
      }
      if (point.y + point.dy <= 0 || point.y + point.dy >= p.windowHeight) {
        point.dy = -point.dy;
      }
      point.x += point.dx;
      point.y += point.dy;
      p.ellipse(point.x, point.y, point.d, point.d);
    }
    p.pop();
  };

  // p.mouseClicked = function () {
  //   const dx = random_range_float(-3, 3);
  //   const dy = random_range_float(-3, 3);
  //   const d = random_range(10, 20);
  //   const point: Point = {
  //     x: p.windowWidth / 2,
  //     y: p.windowHeight / 2,
  //     dx,
  //     dy,
  //     d,
  //   };
  //   points.push(point);
  // };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    init();
  };
}
