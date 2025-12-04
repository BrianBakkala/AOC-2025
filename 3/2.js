readFile(3, 1, function (r)
{
    const banks = r;
    let sum = 0;

    for (let bank of banks)
    {
        const best = bestInBank(bank, 12);
        // console.log(bank, best);
        sum += best;
    }

    console.log(sum);
});


function bestInBank(bank, maxLength = 2)
{
    let string = "";

    let c = 0;
    while (string.length < maxLength)
    {
        const prospects = [];
        const scores = {};

        let lookahead = 0;

        while (!!bank[c + lookahead])
        {
            const index = c + lookahead;
            const char = bank[index];
            const remainingAfter = bank.length - 1 - (index);

            //max possible length if picking this character
            const maxStringLength = string.length + char.length + remainingAfter;

            scores[char] = scores[char] ?? index;

            //if there are enough remaining characters to reach max length
            const wiggleRoom = maxStringLength - maxLength;
            if (wiggleRoom >= 0)
            {
                prospects.push(char);
            }

            lookahead++;
        }

        const bestProspect = Math.max(...prospects.map(x => +x));

        //skip to next character after best prospect
        c = scores[bestProspect];
        string += bestProspect;

        c++;
    }

    return +string;

}