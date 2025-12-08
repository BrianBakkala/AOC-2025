const circuits = [];
let distances = [];
let pairs = [];

readFile(8, 0, function (r)
{
    for (let box1Index in r)
    {
        const box1 = r[box1Index];

        for (let box2Index in r)
        {
            const box2 = r[box2Index];

            if (box1Index !== box2Index)
            {
                const pair = [box1, box2].sort();
                if (!pairs.includes(pair.toString()))
                {
                    const distance = getDistance(box1, box2);
                    pairs.push(pair.toString());
                    distances.push({ pair, distance });
                }

            }
        }
    }

    distances = distances.sort((a, b) => a.distance - b.distance);

    // for (const pairObject of distances)
    for (let i = 0; i < 10; i += 1)
    {
        const pairObject = distances[i];
        console.log(pairObject.pair);
        addPairToNetwork(pairObject);
    }

    console.log(circuits);
    // console.log(distances);

});

function getDistance(box1, box2)
{
    const [x1, y1, z1] = box1.split(",");
    const [x2, y2, z2] = box2.split(",");

    const radical = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
    return Math.sqrt(radical);
}

function addPairToNetwork(pairObj)
{
    const addValuesToCircuit = function (values, circuitIndex)
    {
        if (circuitIndex !== -1)
        {
            circuits[circuitIndex].list.push(...values);
            circuits[circuitIndex].list = arrayUnique(circuits[circuitIndex].list);
        }
        else
        {
            circuits.push({ list: [...values] });
        }

    };

    if (circuits.length === 0)
    {
        console.warn(pairObj.pair, "0");

        addValuesToCircuit(pairObj.pair, -1);
        return;
    }

    //find existing node links

    const matches = { 0: false, 1: false };
    for (const circuitListIndex in circuits)
    {

        for (let val of [0, 1])
        {
            if (circuits[circuitListIndex].list.includes(pairObj.pair[val]))
            {
                matches[val] = +circuitListIndex;
            }
        };
    }


    // handle network cases

    if (Object.values(matches).every((x) => x === false))
    {
        console.warn(pairObj.pair, "1");
        addValuesToCircuit(pairObj.pair, -1);
    }
    else if (!Object.values(matches).some((x) => x === false))
    {
        if (matches[0] != matches[1])
        {
            //merge alert
            console.warn(pairObj.pair, "2");

            const connectableCircuits = Object.values(matches);

            console.log(pairObj.pair);
            console.log(matches);
            console.log(circuits[matches[0]]);
            console.log(circuits[matches[1]]);
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
        }
        else
        {
            //already in the same circuit
            console.warn(pairObj.pair, "2b");
        }


    }
    else if (matches[0] !== false)
    {
        console.warn(pairObj.pair, "3");

        addValuesToCircuit([pairObj.pair[1]], matches[0]);
    }
    else if (matches[1] !== false)
    {
        console.warn(pairObj.pair, "4");

        addValuesToCircuit([pairObj.pair[0]], matches[1]);

    }






}