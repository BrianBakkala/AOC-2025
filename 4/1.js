readFile(4, 1, function (diagram)
{

    const result = forkliftRound(diagram);
    console.log(result);
});


function forkliftRound(diagram)
{
    let count = 0;

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
                    // console.log(rowIndex, colIndex, neighbors.list, neighbors.rolls);
                    count++;
                }
            }
        }
    }
    return count;

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