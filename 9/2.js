const vertices = [];
let maxX = 0;
let maxY = 0;

readFile(9, 1, function (r)
{

    for (let unitIndex in r)
    {
        const unit = r[unitIndex];
        const [x, y] = (unit.split(",").map(Number));

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

    console.log(vertices);
    console.log(geometric);

    return;
});
