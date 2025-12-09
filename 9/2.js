let perimeterPoints = [];
let perimeterPointsX = {};
let perimeterPointsY = {};

const vertices = [];
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
        const unit = r[unitIndex];
        const prevUnit = r[unitIndex - 1 < 0 ? r.length - 1 : unitIndex - 1];


        const [x, y] = (unit.split(",").map(Number));
        const [prevX, prevY] = (prevUnit.split(",").map(Number));

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


    for (let parts = 10; parts > 4; parts--)
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



        for (const point1 of outsidePoints)
        {
            console.log("@");
            for (const point2 of outsidePoints)
            {
                // const area = calcArea(point1, point2);

                //         if (area > bestArea)
                //         {
                //             bestArea = area;
                //             bestPoints = [point1, point2];
                //         }
            }
        }


    }
    console.log(interiorPointsY);
    console.log(interiorPointsX);
    console.log(pairs);

    const result = Math.max(...Object.values(pairs).map(Number));
    console.log(result);

});


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
            interiorPoints.push(point);
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