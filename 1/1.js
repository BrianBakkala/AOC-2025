readFile(1, 1, true, function (r)
{
    const startingNumber = 50;
    const wheelSize = 100;

    let workingNumber = startingNumber;
    let countZeroes = 0;
    for (let instruction of r)
    {
        const direction = instruction[0];
        const distance = +instruction.slice(1);

        if (direction === "R")
        {
            workingNumber += distance;
            while (workingNumber >= wheelSize) workingNumber -= wheelSize;
        }
        else if (direction === "L")
        {
            workingNumber -= distance;
            while (workingNumber < 0) workingNumber += wheelSize;
        }

        if (workingNumber === 0)
        {
            countZeroes += 1;
        }

        // console.log(direction, distance, workingNumber);
    }

    console.log(countZeroes);

});