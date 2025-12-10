const shape = [];
const pairs = [];

best = 0;

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


    for (let ind1 in shape)
    {
        for (let ind2 in shape)
        {
            if (ind1 !== ind2)
            {
                pairs.push([shape[ind1], shape[ind2]]);
            }
        }
    }

    let pairCount = 0;
    const startingPoint = performance.now();
    for (const pair of pairs)
    {
        if (pairCount % (pairs.length / 10) == 0)
        {
            printTimeRemaining(startingPoint, pairCount, pairs.length);
        }
        const isValid = rectangleIsEntirelyInShape(pair);

        if (isValid)
        {
            const area = getArea(pair);
            if (area > best)
            {
                best = area;
            }
        }
        pairCount += 1;

    }

    const result = best;

    console.log(result);
    console.log(result === 1544362560);

    return;
});

function rectangleIsEntirelyInShape(pair)
{
    const epsilon = 1e-6;

    const rect = getRectangle(pair);
    const scaled = geometric.polygonScale(rect, (1 - epsilon));

    return geometric.polygonInPolygon(scaled, shape, (epsilon / 10));
}


function getRectangle(pair)
{
    const [p1, p3] = pair;

    const x1 = Math.min(p1[0], p3[0]);
    const x2 = Math.max(p1[0], p3[0]);
    const y1 = Math.min(p1[1], p3[1]);
    const y2 = Math.max(p1[1], p3[1]);

    return [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
        [x1, y1],
    ];
}


function getArea(pair)
{
    const [point1, point3] = pair;
    const width = 1 + Math.abs(point3[0] - point1[0]);
    const height = 1 + Math.abs(point3[1] - point1[1]);

    return width * height;
}