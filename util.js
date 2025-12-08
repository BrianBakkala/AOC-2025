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

