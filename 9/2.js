let perimiterPoints = [];
const vertices = [];
const pairs = {};
let maxX = 0;
let maxY = 0;

readFile(9, 0, function (r)
{


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
                perimiterPoints.push(prepCoords({ x, y: midY }));
            }
        }
        else if (prevY === y)
        {
            for (let midX = Math.min(x, prevX); midX < Math.max(x, prevX); midX++)
            {
                perimiterPoints.push(prepCoords({ x: midX, y }));
            }
        }

        perimiterPoints.push(prepCoords({ x, y }));
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

    perimiterPoints = perimiterPoints.sort((a, b) => +a.split("_")[0] - +b.split("_")[0]);


    calcArea({ x: 9, y: 5 }, { x: 2, y: 3 });

    return;
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

        console.log(outsidePoints);

        for (const point1 of outsidePoints)
        {
            for (const point2 of outsidePoints)
            {
                const area = calcArea(point1, point2);

                if (area > bestArea)
                {
                    bestArea = area;
                    bestPoints = [point1, point2];
                }
            }
        }


    }
    console.log(pairs);
    console.log(calcArea(...bestPoints));


});


function calcArea(point1, point2)
{
    const pairString = [point1, point2].map(toString).sort().join(":");

    const point3 = { x: point1.x, y: point2.y };
    const point4 = { x: point2.x, y: point1.y };

    const height = 1 + Math.abs(point1.y - point2.y);
    const width = 1 + Math.abs(point1.x - point2.x);
    const area = height * width;

    const perimeterIsValid = checkPerimeter(point1, point2, point3, point4);
    console.log(perimeterIsValid);

    if (perimeterIsValid)
    {
        console.log(perimeterIsValid);
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

    console.log(point1, point2, point3, point4);
    const minX = Math.min(point1.x, point2.x, point3.x, point4.x);
    const maxX = Math.max(point1.x, point2.x, point3.x, point4.x);

    const minY = Math.min(point1.y, point2.y, point3.y, point4.y);
    const maxY = Math.max(point1.y, point2.y, point3.y, point4.y);


    const minYInteriorPoints = getInteriorYPoints(minY);
    const maxYInteriorPoints = getInteriorYPoints(maxY);

    const minXInteriorPoints = getInteriorYPoints(minX);
    const maxXInteriorPoints = getInteriorYPoints(maxX);

    console.log(minYInteriorPoints);


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

function getInteriorYPoints(y)
{
    let inside = false;
    let wasOnPerimeter = false;
    let interiorPoints = [];
    for (let x = 0; x <= maxX; x++)
    {
        const point = prepCoords({ y, x });
        const isOnPerimeter = perimiterPoints.includes(point);
        const transitionPoint = isOnPerimeter !== wasOnPerimeter;

        console.log(point);
        console.log(transitionPoint);

        if (transitionPoint)
        {
            if (!inside)
            {
                inside = true;
            }
            else
            {
                interiorPoints.push(point);
                inside = false;
            }
        }

        if (inside)
        {
            interiorPoints.push(point);
        }

        wasOnPerimeter = isOnPerimeter;

    }

    return interiorPoints;
}

function getInteriorXPoints(x)
{
    let inside = false;
    let interiorPoints = [];
    for (let y = 0; y <= maxY; y++)
    {
        const point = prepCoords({ y, x });
        const isOnPerimeter = perimiterPoints.includes(point);
        if (isOnPerimeter)
        {
            if (!inside)
            {
                inside = true;
            }
            else
            {
                interiorPoints.push(point);
                inside = false;
            }
        }

        if (inside)
        {
            interiorPoints.push(point);
        }

    }

    return interiorPoints;
}

function prepCoords(point)
{
    return `${point.x}_${point.y}`;
}