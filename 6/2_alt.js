const operatorFunctions = {
    "+": (numbers) => numbers.reduce((t, i) => +t + +i, 0),
    "*": (numbers) => numbers.reduce((t, i) => +t * +i, 1),
};


readFile(6, 1, function (r)
{
    const equations = measureEquations(r);

    for (let lineIndex in r)
    {
        const lineCharacters = r[lineIndex].split("");

        let equationIndex = 0;
        let numberIndex = 0;

        for (let charIndex in lineCharacters) 
        {
            const character = lineCharacters[charIndex];

            //check for digit
            if (!Object.keys(operatorFunctions).includes(character) && character.trim() !== "")
            {
                equations[equationIndex].numbers[numberIndex] = equations[equationIndex].numbers[numberIndex] ?? "";
                equations[equationIndex].numbers[numberIndex] += (character);
            }

            //if we are at the end of an equation column
            if (numberIndex === equations[equationIndex].width)
            {
                //next equation
                equationIndex++;

                //new first number
                numberIndex = 0;
            }
            else 
            {
                //next number
                numberIndex++;
            }

        }

    }

    const evaluatedLines = Object.values(equations).map(line => evalLine(line));
    const sum = evaluatedLines.reduce((t, i) => +t + +i, 0);

    console.log(sum);


}, "\n");


function measureEquations(input)
{
    const lastRowChars = input[input.length - 1].split("");

    const equations = {};
    let equationIndex = -1;

    //find equation column widths by traversing operator row
    for (let charIndex in lastRowChars)
    {
        const character = lastRowChars[charIndex];

        //if operator
        if (Object.keys(operatorFunctions).includes(character))
        {
            //demarcate column
            equationIndex++;
            equations[equationIndex] = { operator: character, width: 0, numbers: [] };
        }
        //else add to width
        else if (character.trim() === "")
        {
            equations[equationIndex].width += 1;
        }
    }
    return equations;
}

function evalLine(line)
{
    const numbers = line.numbers.map(Number);
    const selectedOperator = line.operator;

    return operatorFunctions[selectedOperator](numbers);
}