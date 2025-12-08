const circuits = [];

const NUM_CLOSEST_CIRCUITS = 1000;
const NUM_LARGEST_CIRCUITS = 3;

readFile(8, 1, function (r)
{
    let distances = Object.values(calcDistanceObjects(r))
        .sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < NUM_CLOSEST_CIRCUITS; i += 1)
    {
        const pairObject = distances[i];
        addPairToNetwork(pairObject);
    }

    const result = circuits
        .map(x => x.list.length)
        .sort((a, b) => b - a)
        .slice(0, NUM_LARGEST_CIRCUITS)
        .reduce((t, i) => t *= i, 1);

    console.log(result);

});

function insertValue(arr, newValue)
{

    if (arr.length === 0)
    {
        return arr = [newValue];
    }

    let found = false;
    for (let valueIndex in arr)
    {
        const arrValue = arr[valueIndex];
        if (newValue === arrValue)
        {
            return arr;
        }
        else if (newValue < arrValue)
        {
            arr = [
                ...arr.slice(0, +valueIndex),
                newValue,
                ...arr.slice(+valueIndex)
            ];
            found = true;
            break;
        }
    }

    if (!found)
    {
        arr.push(newValue);
    }
    return arr;
}

function calcDistanceObjects(r)
{
    let distances = [];
    let rawDistances = calcRawDistances(r);

    const maxRawDistance = Math.max(...rawDistances);

    for (let box1Index in r)
    {
        const box1 = r[box1Index];

        for (let box2Index in r)
        {
            const box2 = r[box2Index];

            if (box1Index !== box2Index)
            {
                const distance = getDistance(box1, box2);
                if (distance <= maxRawDistance)
                {
                    const pair = [box1, box2];
                    const pairString = [box1, box2].sort().join(":");
                    distances[pairString] = { pair, distance };
                }
            }
        }

    }
    return distances;
}

function calcRawDistances(r)
{
    let rawDistances = [];
    let maxDistanceThreshold = Number.MAX_SAFE_INTEGER;
    for (let box1Index in r)
    {
        const box1 = r[box1Index];

        for (let box2Index in r)
        {
            const box2 = r[box2Index];

            if (box1Index !== box2Index)
            {
                const distance = getDistance(box1, box2);
                if (distance < maxDistanceThreshold)
                {
                    if (rawDistances.length >= NUM_CLOSEST_CIRCUITS)
                    {
                        rawDistances = insertValue(rawDistances, distance)
                            .slice(0, NUM_CLOSEST_CIRCUITS);
                        maxDistanceThreshold = Math.max(...rawDistances);
                    }
                    else
                    {
                        rawDistances = insertValue(rawDistances, distance);
                    }
                }

            }
        }

    }
    return rawDistances;
}




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

    const mergeCircuits = function (index1, index2)
    {
        const list1 = circuits[index1].list;
        const list2 = circuits[index2].list;
        const combined = arrayUnique([...list1, ...list2]);

        circuits[index1].list = combined;
        circuits.splice(index2, 1);
    };

    if (circuits.length === 0)
    {
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

    //no circuit has either value
    if (Object.values(matches).every((x) => x === false))
    {
        addValuesToCircuit(pairObj.pair, -1);
    }
    //both values are in a circuit
    else if (!Object.values(matches).some((x) => x === false))
    {
        //different circuits
        if (matches[0] != matches[1])
        {
            addValuesToCircuit([...pairObj.pair], matches[0]);
            mergeCircuits(matches[0], matches[1]);
        }
        //else already in the same circuit
    }
    //first value is in a circuit
    else if (matches[0] !== false)
    {
        addValuesToCircuit([pairObj.pair[1]], matches[0]);
    }
    //second value is in a circuit
    else if (matches[1] !== false)
    {
        addValuesToCircuit([pairObj.pair[0]], matches[1]);
    }

}