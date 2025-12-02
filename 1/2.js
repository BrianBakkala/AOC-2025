readFile(1, 1, function (r)
{
    const START_NUMBER = 50;
    const WHEEL_SIZE = 100;

    let workingNumber = START_NUMBER;
    let countZeroes = 0;

    for (let instruction of r)
    {
        const directionMap = { R: 1, L: -1 };
        const directionInstruction = instruction[0];
        const directionalStep = directionMap[directionInstruction];

        const distance = +instruction.slice(1);

        for (let i = 0; i < distance; i += 1)
        {
            workingNumber += directionalStep;

            if (workingNumber === WHEEL_SIZE)
            {
                workingNumber = 0;
            }
            else if (workingNumber < 0)
            {
                workingNumber = WHEEL_SIZE - 1;
            }


            if (workingNumber === 0)
            {
                countZeroes++;
            }

        }
    }

    console.log(countZeroes);
});