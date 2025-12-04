readFile(3, 0, function (r)
{
    // const banks = r;
    // let sum = 0;

    // for (let bank of banks)
    // {
    //     const best = bestInBank(bank);
    //     // console.log(bank, best);
    //     sum += best;
    // }

    // console.log(sum);


});


function bestInBank(bank)
{

    const MAX_LENGTH = 3;
    let string = "";

    for (let c = 0; c < bank.length; c++)
    {
        const char = bank[c];

        console.log(char);
        const scores = {};
        for (let lookahead = 1; lookahead <= bank.length; lookahead++)
        {
            if (c + lookahead >= bank.length)
            {
                break;
            }

            const nextChar = bank[c + lookahead];
            if (MAX_LENGTH - (lookahead + 1) >= 0)
            {
                scores[nextChar] = scores[nextChar] ?? {
                    char: nextChar,
                    index: c + lookahead,
                    leftover: bank.slice(c + lookahead + 1),
                    leftover_length: bank.slice(c + lookahead + 1).length,
                    wiggle: MAX_LENGTH - (lookahead + 1),
                };
            }

        }

        const decision = Math.max(Object.keys(scores));
        console.log(scores, decision);
        const updatedString = string + bank.slice(c, scores[decision].index + 1);

        c = scores[decision].index;
        string = updatedString;

        console.log(string);
    }

}


console.log(bestInBank("91112"));