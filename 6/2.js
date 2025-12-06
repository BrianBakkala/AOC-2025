const operatorFunctions = {
    "+": (numbers) => numbers.reduce((t, i) => +t + +i, 0),
    "*": (numbers) => numbers.reduce((t, i) => +t * +i, 1),
};

readFile(6, 1, function (r)
{
    const lines = transpose(r);
    let equationIndex = 0;
    const equations = [];

    for (let rowIndex in lines)
    {
        let row = lines[rowIndex];

        //if empty row, prep next equation
        if (row.join("").trim() === "")
        {
            equationIndex++;
            continue;
        }

        equations[equationIndex] = equations[equationIndex] ?? { numbers: [], operator: "" };

        //grab and remove operator if last char
        const lastChar = row[row.length - 1];
        if (Object.keys(operatorFunctions).includes(row[row.length - 1]))
        {
            equations[equationIndex].operator = lastChar;
            row.pop();
        }

        //add number
        equations[equationIndex].numbers.push(+row.join(""));
    }


    const evaluatedLines = Object.values(equations)
        .map(line => operatorFunctions[line.operator](line.numbers));
        
    const sum = evaluatedLines.reduce((t, i) => +t + +i, 0);

    console.log(sum);

}, "\n");


function transpose(arr)
{
    const newArray = [];

    for (let rowIndex in arr)
    {
        for (let colIndex in arr[rowIndex])
        {
            newArray[colIndex] = newArray[colIndex] ?? [];
            newArray[colIndex][rowIndex] = arr[rowIndex][colIndex];
        }
    }

    return newArray;
} 