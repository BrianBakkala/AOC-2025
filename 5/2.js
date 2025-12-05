readFile(5, 1, function (r)
{
    let [ranges, ids] = r;
    ranges = ranges.split("\r\n");
    ranges = ranges.map(range =>
    {
        const [start, end] = range.split("-");
        return { start: +start, end: +end };
    });

    ranges = mergeRanges(ranges);
    count = tabulateRanges(ranges);
    console.log(count);


}, "\r\n\r\n", true);

function mergeRanges(ranges)
{
    for (let rangeIndex in ranges)
    {
        const range = ranges[rangeIndex];

        for (let compareIndex in ranges)
        {
            const compareRange = ranges[compareIndex];

            //check for mergeable
            if (compareIndex != rangeIndex
                && (
                    (range.start < compareRange.end && range.end > compareRange.start) // overlapping
                    || (range.end == compareRange.start) // adjacent
                    || (range.end + 1 == compareRange.start) // consecutive
                    || (range.start == compareRange.start) // coterminous start
                    || (range.end == compareRange.end)// coterminous end
                )
            )
            {

                //fix one
                ranges[rangeIndex] = {
                    start: Math.min(range.start, compareRange.start),
                    end: Math.max(range.end, compareRange.end)
                };
                ranges.splice(compareIndex, 1);

                //restart on the rest
                return mergeRanges(ranges);
            }
        }

    }

    //made it through without fixing any
    return ranges.sort((a, b) => a.start - b.start);
}

function tabulateRanges(ranges)
{
    let count = 0;
    for (let range of ranges)
    {
        count += (range.end - range.start + 1);
    }
    return count;
} 