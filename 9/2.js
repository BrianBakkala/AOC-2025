const shape = [];
let maxX = 0;
let maxY = 0;

readFile(9, 0, function (r)
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
    console.log(geometric.polygonArea(shape));
    shape.push(r[0].split(",").map(Number));
    console.log(geometric.polygonArea(shape));


    for (let ind1 in shape)
    {
        for (let ind2 in shape)
        {
            if (ind1 !== ind2
                && shape[ind1][0] != shape[ind2][0]
                && shape[ind1][1] != shape[ind2][1]



                && shape[ind1][0] != shape[ind2][1]
                && shape[ind1][1] != shape[ind2][0]
            )
            {
                const point1 = shape[ind1];
                const point2 = shape[ind2];

                // console.log([point1, point2]);
                console.log(extendRectangle(point1, point2));
                break;
            }
        }
        break;

    }

    // console.log(shape);
    // console.log(geometric.polygonBounds(shape));

    return;
});


function extendRectangle(point1, point2)
{
    const cornerPoints = [point1, point2];

    const minX = Math.min(point1[0], point2[0]);
    const minY = Math.min(point1[1], point2[1]);

    console.log(cornerPoints);




}