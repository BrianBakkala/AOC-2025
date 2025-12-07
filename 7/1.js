readFile(7, 1, function (r)
{

    let splitCount = 0
    for (let rowIndex in r)
    {
        const prevRow = r[+rowIndex - 1];
        const row = r[rowIndex];

        if (!prevRow)
        {
            continue;
        }
        for (let charIndex in prevRow.split(""))
        {
            charIndex = +charIndex;
            const prevChar = prevRow.split("")[charIndex];
            const char = row.split("")[charIndex];

            //continue down
            if (prevChar === "S" || prevChar === "|")
            {
                r[+rowIndex] = r[rowIndex].slice(0, charIndex) + "|" + r[rowIndex].slice(+charIndex + 1);
            }
            if (char === "^" && (prevChar === "S" || prevChar === "|"))
            {
                splitCount += 1;
                r[+rowIndex] = r[rowIndex].slice(0, charIndex - 1) + "|^|" + r[rowIndex].slice(+charIndex + 2);
            }
        }
    }

    // console.log(r.join("\n"));
    console.log(splitCount);


});