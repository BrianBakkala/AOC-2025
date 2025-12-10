let perimeterPoints = [];
let perimeterPointsX = {};
let perimeterPointsY = {};

let neighbors = {};

const vertices = [];
const consecutivePairs = [];
const pairs = {};
const interiorPointsY = {};
const interiorPointsX = {};
let maxX = 0;
let maxY = 0;

readFile(9, 1, function (r)
{

    const pushPerimeterPoints = ({ x, y }) =>
    {
        const coordsString = prepCoords({ x, y });
        perimeterPoints.push(coordsString);

        perimeterPointsX[x] = perimeterPointsX[x] ?? [];
        perimeterPointsX[x].push(coordsString);


        perimeterPointsY[y] = perimeterPointsY[y] ?? [];
        perimeterPointsY[y].push(coordsString);
    };


    let bestArea = 0;
    let bestPoints;

    for (let unitIndex in r)
    {
        const unit = r.at(unitIndex);
        const prevUnit = r.at(unitIndex - 1);
        const prevPrevUnit = r.at(unitIndex - 2);

        const [x, y] = (unit.split(",").map(Number));
        const [prevX, prevY] = (prevUnit.split(",").map(Number));
        const [ppX, ppY] = (prevPrevUnit.split(",").map(Number));

        neighbors[prepCoords({ x: prevX, y: prevY })] = [
            { x, y },
            { x: ppX, y: ppY },
        ];

        if (prevX === x)
        {
            for (let midY = Math.min(y, prevY); midY < Math.max(y, prevY); midY++)
            {
                pushPerimeterPoints({ x, y: midY });
            }
        }
        else if (prevY === y)
        {
            for (let midX = Math.min(x, prevX); midX < Math.max(x, prevX); midX++)
            {
                pushPerimeterPoints({ x: midX, y });
            }
        }

        pushPerimeterPoints({ x, y });
        vertices.push({ x, y });
        consecutivePairs.push({ x1: prevX, y1: prevY, x2: x, y2: y });
        if (x > maxX)
        {
            maxX = x;
        }
        if (y > maxY)
        {
            maxY = y;
        }
    }


    console.log(consecutivePairs.map(({ x1, y1, x2, y2 }) => `((1-t)*${x1}+t*${x2},(1-t)*${y1}+t*${y2})`)
        .join(", "));

    return;

    perimeterPoints = perimeterPoints.sort((a, b) => +a.split("_")[0] - +b.split("_")[0]);

    const keys = Object.keys(neighbors);
    for (const point1StringIndex in keys)
    {
        const point1String = keys[point1StringIndex];
        if (point1StringIndex % parseInt(keys.length / 16) === 0)
        {
            console.log(point1StringIndex, "/", keys.length);
        }

        const neighbs = neighbors[point1String];
        const area = calcAreaBetter(point1String, ...neighbs);

        if (area > bestArea)
        {
            bestArea = area;
            bestPoints = [neighbs[0], neighbs[1]];
        }
    }


    // console.log(vertices);
    // console.log(neighbors);
    // console.log(interiorPointsY);
    // console.log(interiorPointsX);
    // console.log(pairs);

    const result = Math.max(...Object.values(pairs).map(Number));
    console.log(result, result === 162180888);

    //4652231070
    //162180888

});

function calcAreaBetter(mainPoint, neighbor1, neighbor2)
{

    const [x1, y1] = mainPoint.split("_").map(Number);

    //get point 4
    const otherX = x1 == neighbor1.x ? neighbor2.x : neighbor1.x;
    const otherY = y1 == neighbor1.y ? neighbor2.y : neighbor1.y;

    const point1 = { x: x1, y: y1 };
    const point4 = { x: otherX, y: otherY };

    const pairString = [point1, point4].map(prepCoords).sort().join(":");

    if (pairs.hasOwnProperty(pairString))
    {
        return pairs[pairString];
    }


    //check if point 4 is inside the shape
    const isInteriorPoint = isInterior(point4.x, point4.y);
    if (!isInteriorPoint)
    {
        const result = false;
        pairs[pairString] = result;
        return result;
    }


    //get area from neighbor1 and neighbor2
    const height = 1 + Math.abs(neighbor1.y - neighbor2.y);
    const width = 1 + Math.abs(neighbor1.x - neighbor2.x);
    const area = height * width;

    pairs[pairString] = area;
    return area;

}


function checkPerimeter(point1, point2, point3, point4)
{
    const minX = Math.min(point1.x, point2.x, point3.x, point4.x);
    const maxX = Math.max(point1.x, point2.x, point3.x, point4.x);

    const minY = Math.min(point1.y, point2.y, point3.y, point4.y);
    const maxY = Math.max(point1.y, point2.y, point3.y, point4.y);

    const minYInteriorPoints = getInteriorPointsAtY(minY);
    const maxYInteriorPoints = getInteriorPointsAtY(maxY);

    const minXInteriorPoints = getInteriorPointsAtX(minX);
    const maxXInteriorPoints = getInteriorPointsAtX(maxX);

    for (let x = minX; x <= maxX; x += 1)
    {
        const minPoint = prepCoords({ y: minY, x });
        const maxPoint = prepCoords({ y: maxY, x });

        if (!minYInteriorPoints.includes(minPoint)
            || !maxYInteriorPoints.includes(maxPoint))
        {
            return false;
        }
    }

    for (let y = minY; y <= maxY; y += 1)
    {
        const minPoint = prepCoords({ x: minX, y });
        const maxPoint = prepCoords({ x: maxX, y });

        if (!minXInteriorPoints.includes(minPoint)
            || !maxXInteriorPoints.includes(maxPoint))
        {
            return false;
        }
    }


    return true;

}

function isInterior(x, y)
{
    const interiorY = getInteriorPointsAtY(y, x + 1);
    if (!interiorY.includes(x))
    {
        return false;
    }
    const interiorX = getInteriorPointsAtX(x, y + 1);
    if (!interiorX.includes(y))
    {
        return false;
    }

    return true;
}

function getInteriorPointsAtY(y)
{
    if (interiorPointsY.hasOwnProperty(y))
    {
        return interiorPointsY[y];
    }

    let inside = false;
    let wasOnPerimeter = false;
    let interiorPoints = [];
    let perimPoints = perimeterPointsY[y];

    for (let x = 0; x <= maxX; x++)
    {
        const point = prepCoords({ y, x });
        const isOnPerimeter = perimPoints.includes(point);
        const justHitPerim = (isOnPerimeter && !wasOnPerimeter);

        if (justHitPerim)
        {
            if (!inside && justHitPerim)
            {
                inside = true;
            }
            else if (inside && justHitPerim)
            {
                inside = false;
            }
        }

        if (isOnPerimeter || inside)
        {
            interiorPoints.push(x);
        }

        wasOnPerimeter = isOnPerimeter;

    }

    const result = arrayUnique(interiorPoints);
    interiorPointsY[y] = result;
    return result;
}

function getInteriorPointsAtX(x)
{
    if (interiorPointsX.hasOwnProperty(x))
    {
        return interiorPointsX[x];
    }

    let inside = false;
    let wasOnPerimeter = false;
    let interiorPoints = [];
    let perimPoints = perimeterPointsX[x];

    for (let y = 0; y <= maxY; y++)
    {
        const point = prepCoords({ y, x });
        const isOnPerimeter = perimPoints.includes(point);
        const justHitPerim = (isOnPerimeter && !wasOnPerimeter);

        if (justHitPerim)
        {
            if (!inside && justHitPerim)
            {
                inside = true;
            }
            else if (inside && justHitPerim)
            {
                inside = false;
            }
        }

        if (isOnPerimeter || inside)
        {
            interiorPoints.push(y);
        }

        wasOnPerimeter = isOnPerimeter;

    }

    const result = arrayUnique(interiorPoints);
    interiorPointsX[x] = result;
    return result;
}

function prepCoords(point)
{
    return `${point.x}_${point.y}`;
}