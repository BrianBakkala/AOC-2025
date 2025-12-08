const circuits = {};

readFile(8, 0, function (r)
{

    let bestPair = [];
    let bestDistance = Number.MAX_SAFE_INTEGER;

    for (let box1Index in r)
    {
        const box1 = r[box1Index];

        for (let box2Index in r)
        {
            const box2 = r[box2Index];

            if (box1Index !== box2Index)
            {
                const pair = [box1, box2];
                const distance = getDistance(box1, box2);

                if (distance < bestDistance)
                {
                    bestDistance = distance;
                    bestPair = pair;
                }

            }
        }
    }

    console.log(bestDistance, bestPair);

});

function getDistance(box1, box2)
{
    const [x1, y1, z1] = box1.split(",");
    const [x2, y2, z2] = box2.split(",");

    const radical = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
    return Math.sqrt(radical);
}