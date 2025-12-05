readFile(4, 1, function (diagram)
{
    let sum = 0;
    let result;

    do
    {
        result = forkliftRound(diagram, true);
        sum += result.count;
    }
    while (result.count > 0);

    console.log(sum);
});
const formatIndices = (rowIndex, colIndex) => [+rowIndex, +colIndex].join(":");

function removeIndices(diagram, indices, replacement = ".")
{
    for (let rowIndex in diagram)
    {
        for (let colIndex in diagram[rowIndex])
        {
            if (indices.includes(formatIndices(rowIndex, colIndex)))
            {
                diagram[rowIndex] =
                    diagram[rowIndex].substring(0, colIndex)
                    + replacement
                    + diagram[rowIndex].substring(+colIndex + 1);
            }
        }
    }
    return diagram;
}


function forkliftRound(diagram, remove = true)
{
    let count = 0;
    const indicesToRemove = [];

    for (let rowIndex in diagram)
    {
        const row = diagram[rowIndex];
        for (let colIndex in row)
        {
            const roll = row[colIndex];

            if (roll === "@")
            {
                const neighbors = getNeighbors(diagram, +rowIndex, +colIndex);

                if (neighbors.rolls < 4)
                {
                    indicesToRemove.push(formatIndices(rowIndex, colIndex));
                    count++;
                }
            }
        }
    }
    return {
        count,
        diagram: (remove ? removeIndices(diagram, indicesToRemove) : diagram),
        indices: indicesToRemove
    };

}


function getNeighbors(diagram, rowIndex, colIndex)
{
    const list = [

        diagram[rowIndex - 1]?.[colIndex - 1],
        diagram[rowIndex - 1]?.[colIndex],
        diagram[rowIndex - 1]?.[colIndex + 1],


        diagram[rowIndex][colIndex - 1],
        diagram[rowIndex][colIndex + 1],

        diagram[rowIndex + 1]?.[colIndex - 1],
        diagram[rowIndex + 1]?.[colIndex],
        diagram[rowIndex + 1]?.[colIndex + 1],

    ];

    const rolls = list.filter(x => x === "@").length;
    const floors = list.filter(x => x === ".").length;

    return { list, rolls, floors };
}