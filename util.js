async function readFile(day, number, splitLines = false, callback = () => { })
{
    return await fetch(`${day}/${number}.txt`)
        .then(r => r.text())
        .then(r => callback(
            splitLines ? r.split("\r\n") : r
        ));
}