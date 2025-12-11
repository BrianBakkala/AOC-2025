readFile(11, 1, function (r)
{
    const network = {};
    const paths = [];
    let pathCount = 0;

    for (let unit of r)
    {
        const start = unit.split(":")[0].trim();
        const ends = unit.split(":")[1].trim().split(" ");

        network[start] = ends;
    }

    buildPath([], 'svr');

    function buildPath(pathSoFar, node) 
    {
        if (pathSoFar.includes(node))
        {
            return;
        }
        else if (node === 'out')
        {
            if (pathSoFar.includes('dac') && pathSoFar.includes('fft'))
            {
                // paths.push([...pathSoFar, node]);
                pathCount += 1;
            }
            return;
        }

        const nextNodes = network[node];
        pathSoFar.push(node);
        for (const next of nextNodes)
        {
            buildPath([...pathSoFar], next);
        }
    }

    console.log(paths);
    console.log(pathCount);


});
