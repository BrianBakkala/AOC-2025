readFile(2, 1, function (r)
{

    let sumOfInvalid = 0;
    for (let unit of r)
    {
        const [start, end] = unit.split("-").map(x => +x);


        for (number = start; number <= end; number++)
        {
            if (!isValid(number.toString()))
            {
                sumOfInvalid += number;
            }
        }
    }
    console.log(sumOfInvalid);

}, ",", true);

console.log(isValid("1212"));
function isValid(unit)
{
    return !/^(\d+)\1$/.test(unit);
}