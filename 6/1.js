readFile(6, 1, function (r)
{
    const newLines = {};

    for (let lineIndex in r)
    {
        const parts = r[lineIndex].split(" ").filter(x => x !== "");

        for (let partIndex in parts)
        {
            newLines[partIndex] = newLines[partIndex] ?? [];
            newLines[partIndex].push(parts[partIndex]);
        }

    }

    const evaluatedLines = Object.values(newLines).map(line => evalLine(line));
    const sum = evaluatedLines.reduce((t, i) => +t + +i, 0);

    console.log(sum);


}, "\n", true);


function evalLine(line)
{
    const selectedOperator = line[line.length - 1];
    const numbers = line.slice(0, -1);

    return {
        "+": (numbers) => numbers.reduce((t, i) => +t + +i, 0),
        "*": (numbers) => numbers.reduce((t, i) => +t * +i, 1),
    }[selectedOperator](numbers);
}