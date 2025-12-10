async function readFile(day, number, callback = () => { }, delimiter = "\r\n", trim = false)
{
    return await fetch(`${day}/${number}.txt`)
        .then(r => r.text())
        .then(r =>
            delimiter
                ? r.split(delimiter)
                : r
        )
        .then(r =>
            trim
                ? Array.isArray(r)
                    ? r.map(x => x.trim())
                    : r.trim()
                : r
        )
        .then(r => callback(r));
}

function arrayUnique(arr)
{
    return [...new Set(arr)];
};

function printTimeRemaining(startingPointTimestamp, currentPoint, totalPoint, numIntervals = 20)
{

    if(currentPoint % parseInt(totalPoint/numIntervals) !== 0)
    {
        return;
    }
    const currentTimestamp = performance.now();
    const timeItsTaken = (currentTimestamp - startingPointTimestamp);

    if (currentPoint === 0)
    {
        console.log("―");
        return;
    }
    const timePerThing = timeItsTaken / currentPoint;
    const numRemainingThings = (totalPoint - currentPoint);

    const estMillisecondsRemaining = numRemainingThings * timePerThing;
    const secondsFormatted = `${(estMillisecondsRemaining / 1000).toFixed(2)} seconds remaining`;

    const percentage = currentPoint * 100 / totalPoint;
    const percentageFormatted = `${percentage.toFixed(0)}%`;

    console.log(`${percentageFormatted} ${secondsFormatted}`);
}
