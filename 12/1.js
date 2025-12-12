const newLine = "\r\n";

readFile(12, 0, function (r)
{

    const shapes = r.slice(0, -1).map(x => x.split(":" + newLine)[1]);
    const regions = r.slice(-1)[0].split(newLine).map(x =>
    ({
        width: +x.split(": ")[0].split("x")[0],
        height: +x.split(": ")[0].split("x")[1],
        counts: x.split(": ")[1].split(" "),

    }));
    for (let unit of shapes)
    {
        console.log(unit);
    }
    console.log(regions);


}, newLine + newLine);
