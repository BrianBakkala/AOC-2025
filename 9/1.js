const points = [];


readFile(9, 1, function (r)
{
    let maxX = 0;
    let maxY = 0;

    let bestArea = 0;
    let bestPoints;

    for (let unit of r)
    {
        const [x, y] = (unit.split(",").map(Number));
        points.push({ x, y });
        if (x > maxX)
        {
            maxX = x;
        }
        if (y > maxY)
        {
            maxY = y;
        }
    }


    for (let parts = 10; parts > 4; parts--)
    {

        const xThreshold = maxX / parts;
        const yThreshold = maxY / parts;

        const outsidePoints = points.filter(
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
    console.log(calcArea(...bestPoints));


});


function calcArea(point1, point2)
{
    const height = 1 + Math.abs(point1.y - point2.y);
    const width = 1 + Math.abs(point1.x - point2.x);
    return height * width;
}