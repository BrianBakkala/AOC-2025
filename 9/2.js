const shape = [];
const rectangles = [];
let maxX = 0;
let maxY = 0;

readFile(9, 1, function (r)
{

    for (let unitIndex in r)
    {
        const unit = r[unitIndex];
        const [x, y] = (unit.split(",").map(Number));

        shape.push([x, y]);
        if (x > maxX)
        {
            maxX = x;
        }
        if (y > maxY)
        {
            maxY = y;
        }
    }

    //close polygon
    shape.push(r[0].split(",").map(Number));


    let maxArea = 0;
    let best = null;


    for (let ind1 in shape)
    {
        if (ind1 % 100 == 0)
        {
            console.log(ind1, "/", shape.length);
        }

        for (let ind2 in shape)
        {
            if (ind1 !== ind2)
            {
                const point1 = shape[ind1];
                const point2 = shape[ind2];

                const rectangleDiagonals = [point1, point2];

                // console.log([point1, point2]);
                const rectPoints = getRectanglePoints(...rectangleDiagonals);
                if (!testPoints(rectPoints)) continue;


                const area = getArea(rectPoints[0], rectPoints[2]);
                if (area > maxArea)
                {
                    maxArea = area;
                }

            }
        }
    }

    const result = maxArea;

    console.log(result);
    console.log(result === 4652231070);

    return;
});

function testPoints(points)
{
    for (const p of points)
    {
        if (
            !geometric.pointInPolygon(p, shape) &&
            !geometric.pointOnPolygon(p, shape, 0.01)
        )
        {
            return false;
        }
    }
    return true;
}


function getRectanglePoints(point1, point3)
{
    const point2 = [point3[0], point1[1]];
    const point4 = [point1[0], point3[1]];


    return [
        point1,
        point2,
        point3,
        point4,
    ];

}

function getArea(point1, point3)
{
    const width = 1 + Math.abs(point3[0] - point1[0]);
    const height = 1 + Math.abs(point3[1] - point1[1]);

    return width * height;
}