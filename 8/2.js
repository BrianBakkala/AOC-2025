const circuits = [];
let canFinish = false;

const CIRCUIT_THRESHOLD = 8500;

readFile(8, 1, function (r)
{
    let distances = Object.values(calcDistanceObjects(r))
        .sort((a, b) => a.distance - b.distance);

    for (let i = 0; i < CIRCUIT_THRESHOLD; i += 1)
    {
        const pairObject = distances[i];
        const numCircuits = addPairToNetwork(pairObject);

        if (i % 100 === 0) 
        {
            console.log(i, numCircuits);
        }

        // console.log(JSON.parse(JSON.stringify(circuits)));

        if (numCircuits === 1 && canFinish && circuits[0].list?.length === r.length)
        {
            // console.log(pairObject.pair);

            const result = pairObject.pair
                .map(x => +(x.split(",")[0]))
                .reduce((t, i) => t *= i, 1);
            console.log(i, numCircuits);
            console.log(result);

            return;
        }
    }

    ;


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
    const maxRawDistance = calcRawDistanceThreshold(r);
    const t1 = performance.now();

    for (let box1Index = 0; box1Index < r.length; box1Index++)
    {
        const box1 = r[box1Index];

        for (let box2Index = box1Index+1; box2Index < r.length; box2Index++)
        {
            const box2 = r[box2Index];

            const distance = getDistance(box1, box2);
            if (distance <= maxRawDistance)
            {
                distances.push({ pair: [box1, box2], distance });
            }
        }

    }
    const t2 = performance.now();

    console.log((t2 - t1) / 1000, 'seconds');
    return distances;
}

function calcRawDistanceThreshold(r)
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
                    if (rawDistances.length >= CIRCUIT_THRESHOLD)
                    {
                        rawDistances = insertValue(rawDistances, distance)
                            .slice(0, CIRCUIT_THRESHOLD);
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
    return Math.max(...rawDistances);
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
        return circuits.length;
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

    if (circuits.length >= 2)
    {
        canFinish = true;
    }
    return circuits.length;

}