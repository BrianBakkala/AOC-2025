let perimeterPoints = [];
let perimeterPointsX = {};
let perimeterPointsY = {};

let neighbors = {};

const vertices = [];
const pairs = {};
const interiorPointsY = {};
const interiorPointsX = {};
let maxX = 0;
let maxY = 0;

readFile(9, 0, function (r)
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
        const unit = r[unitIndex];
        const prevUnit = r[unitIndex - 1 < 0 ? r.length - 1 : unitIndex - 1];
        const prevPrevUnit = r[unitIndex - 2 < 0 ? r.length - 2 : unitIndex - 2];


        const [x, y] = (unit.split(",").map(Number));
        const [prevX, prevY] = (prevUnit.split(",").map(Number));
        const [ppX, ppY] = (prevPrevUnit.split(",").map(Number));

        neighbors[prepCoords({ x: prevX, y: prevY })] = [
            { x: prevX, y: prevY },
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
        if (x > maxX)
        {
            maxX = x;
        }
        if (y > maxY)
        {
            maxY = y;
        }
    }

    perimeterPoints = perimeterPoints.sort((a, b) => +a.split("_")[0] - +b.split("_")[0]);


    for (let parts = 10; parts > 1; parts--)
    {
        const xThreshold = maxX / parts;
        const yThreshold = maxY / parts;

        const outsidePoints = vertices.filter(
            function (z)
            {
                if ((z.x < xThreshold || z.y > maxY - xThreshold)
                    || (z.y < yThreshold || z.x > maxX - xThreshold))
                {
                    return true;
                }
                return false;
            }
        );

        for (const point1String of Object.keys(neighbors))
        {
            const neighbs = neighbors[point1String];
            const area = calcAreaBetter(point1String, ...neighbs);

            if (area > bestArea)
            {
                bestArea = area;
                bestPoints = [neighbs[0], neighbs[1]];
            }
        }


    }
    console.log(interiorPointsY);
    console.log(interiorPointsX);
    console.log(pairs);

    const result = Math.max(...Object.values(pairs).map(Number));
    console.log(result);

});

function calcAreaBetter(mainPoint, neighbor1, neighbor2)
{

    const [x1, y1] = mainPoint.split("_").map(Number);


    //get point 4
    const otherX = x1 == neighbor1.x ? neighbor2.x : neighbor1.x;
    const otherY = y1 == neighbor1.y ? neighbor2.y : neighbor1.y;

    const point1 = { x: x1, y: y1 };
    const point4 = { x: otherX, y: otherY };

    const pairString1 = [point1, point4].map(prepCoords).sort().join(":");
    const pairString2 = [neighbor1, neighbor2].map(prepCoords).sort().join(":");

    if (pairs.hasOwnProperty(pairString1))
    {
        const result = pairs[pairString1];
        pairs[pairString1] = result;
        pairs[pairString2] = result;
        return result;
    }
    if (pairs.hasOwnProperty(pairString2))
    {
        const result = pairs[pairString2];
        pairs[pairString1] = result;
        pairs[pairString2] = result;
        return result;
    }


    //check if point 4 is inside the shape
    const isInteriorPoint = isInterior(otherX, otherY);
    if (!isInteriorPoint)
    {
        pairs[pairString1] = false;
        pairs[pairString2] = false;
    }
    console.log(isInteriorPoint);







    //get area from neighbor1 and neighbor2
    const height = 1 + Math.abs(neighbor1.y - neighbor2.y);
    const width = 1 + Math.abs(neighbor1.x - neighbor2.x);
    const area = height * width;

    pairs[pairString1] = area;
    pairs[pairString2] = area;
    return area;

}


function calcArea(point1, point2)
{
    const pairString = [point1, point2].map(prepCoords).sort().join(":");

    if (pairs.hasOwnProperty(pairString))
    {
        return pairs[pairString];
    }

    const point3 = { x: point1.x, y: point2.y };
    const point4 = { x: point2.x, y: point1.y };

    const height = 1 + Math.abs(point1.y - point2.y);
    const width = 1 + Math.abs(point1.x - point2.x);
    const area = height * width;

    const perimeterIsValid = checkPerimeter(point1, point2, point3, point4);

    if (perimeterIsValid)
    {
        pairs[pairString] = area;
    }
    else
    {
        pairs[pairString] = false;
    }

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

function getInteriorPointsAtY(y, maxXValue)
{
    if (interiorPointsY.hasOwnProperty(y))
    {
        return interiorPointsY[y];
    }

    maxXValue = maxXValue ?? maxX;

    let inside = false;
    let wasOnPerimeter = false;
    let interiorPoints = [];
    let perimPoints = perimeterPointsY[y];

    for (let x = 0; x <= maxXValue; x++)
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

function getInteriorPointsAtX(x, maxYValue)
{
    if (interiorPointsX.hasOwnProperty(x))
    {
        return interiorPointsX[x];
    }

    maxYValue = maxYValue ?? maxY;


    let inside = false;
    let wasOnPerimeter = false;
    let interiorPoints = [];
    let perimPoints = perimeterPointsX[x];

    for (let y = 0; y <= maxYValue; y++)
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
            interiorPoints.push(point);
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