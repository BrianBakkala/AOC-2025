readFile(2, 1, function (r)
{

    let sumOfInvalid = 0;
    for (let unit of r)
    {
        const [start, end] = unit.split("-").map(x => +x);


        for (number = start; number <= end; number++)
        {
            if (isInvalid(number.toString()))
            {
                sumOfInvalid += number;
            }
        }
    }
    console.log(sumOfInvalid);

}, ",", true);

function isInvalid(unit)
{
    return /^(\d+)\1+$/.test(unit);
}