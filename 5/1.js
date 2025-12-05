readFile(5, 1, function (r)
{
    let [ranges, ids] = r;
    ranges = ranges.split("\r\n");

    let count = 0;


    for (let idToCheck of ids.split("\r\n"))
    {
        const id = +idToCheck.trim();
        const result = checkRanges(ranges, id);

        count += (result ? 1 : 0);
    }

    console.log(count);

}, "\r\n\r\n", true);

function checkRanges(ranges, id)
{
    for (let range of ranges)
    {
        // console.log(range);
        const result = checkRange(range, id);
        if (result)
        {
            return true;
        }

    }
    return false;
}
function checkRange(range, id)
{
    const [min, max] = range.split("-").map(x => +x.trim());
    // console.log(id, min, max, id >= min && id <= max);

    return (id >= min && id <= max);
}