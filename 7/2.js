let paths = [];
const counts = {};

readFile(7, 1, function (r)
{

    //remove empty lines
    r = r.filter(x =>
    {
        const uniques = [...new Set(x.split(""))];
        return !(uniques[0] === "." && uniques.length === 1);
    });

    const MAX_DEPTH = r.length - 1;
    const startingCol = r[0].indexOf("S");

    const initialStepString = formatCoordinates(0, startingCol);
    paths.push(initialStepString);
    counts[initialStepString] = 1;


    //for each row
    for (let i = 0; i < MAX_DEPTH; i += 1)
    {
        //get all paths that need to be calculated
        const uniquePaths = [...new Set(Object.values(paths))];
        paths = [];

        for (const lastStepString of uniquePaths)
        {
            const lastStep = unFormatCoordinates(lastStepString);
            const nextChar = r[lastStep[0] + 1][lastStep[1]];

            if (nextChar === ".")
            {
                continueStep(lastStepString, lastStep);
            }
            else if (nextChar === "^")
            {
                splitSteps(lastStepString, lastStep);
            }

        }

    }

    //sum up bottom row counts
    const result = Object.entries(counts)
        .filter((arr) => unFormatCoordinates(arr[0])[0] === MAX_DEPTH)  //counts from last row
        .map(arr => arr[1])  // get value
        .reduce((t, i) => t += i, 0); ///sum 


    console.log(result);

});


function continueStep(lastStepString, lastStep)
{
    const nextStepString = formatCoordinates(lastStep[0] + 1, lastStep[1]);

    paths.push(nextStepString);

    mergeStepCounts(nextStepString, lastStepString);
}


function splitSteps(lastStepString, lastStep)
{
    const nextStepLeft = formatCoordinates(lastStep[0] + 1, lastStep[1] - 1);
    const nextStepRight = formatCoordinates(lastStep[0] + 1, lastStep[1] + 1);

    paths.push(nextStepLeft);
    paths.push(nextStepRight);

    mergeStepCounts(nextStepLeft, lastStepString);
    mergeStepCounts(nextStepRight, lastStepString);

}

//merge counts from previous step into new step
function mergeStepCounts(newStepKey, lastStepString)
{
    const oldCounts = +counts[lastStepString] ?? 1;

    counts[newStepKey] = counts[newStepKey] ?? 0;
    counts[newStepKey] += oldCounts;
}

const formatCoordinates = (a, b) => [a, b].join(":");
const unFormatCoordinates = (a) => a.split(":").map(Number);