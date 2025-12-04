readFile(3, 1, function (r)
{
    const banks = r;
    let sum = 0;

    for (let bank of banks)
    {
        const best = bestInBank(bank);
        // console.log(bank, best);
        sum += best;
    }

    console.log(sum);


});

function bestInBank(bank)
{
    const best = 99;
    const worst = 1;
    for (let joltage = best; joltage >= worst; joltage--)
    {
        if (isInBank(joltage, bank))
            return joltage;
    }
}

function isInBank(joltage, bank) 
{
    const [first, second] = joltage.toString().split("");
    if (bank.indexOf(first) === -1) return false;

    return RegExp(`${first}\\d*${second}`, 'g').test(bank);
}
