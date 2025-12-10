class BitArray
{
    numPresses = 0;
    buttonPresses = [];

    constructor(input)
    {
        if (typeof input === "number")
        {
            this.length = input;
            this.arr = new Uint32Array((input + 31) >>> 5);
        } else if (Array.isArray(input))
        {
            this.length = input.length;
            this.arr = new Uint32Array((this.length + 31) >>> 5);

            for (let i = 0; i < input.length; i++)
            {
                if (input[i])
                {
                    this.arr[i >>> 5] |= 1 << (i & 31);
                }
            }
        }
    }

    get(i)
    {
        return (this.arr[i >>> 5] >>> (i & 31)) & 1;
    }
    set(i, val)
    {
        if (val) this.arr[i >>> 5] |= 1 << (i & 31);
        else this.arr[i >>> 5] &= ~(1 << (i & 31));
    }
    toggle(i)
    {
        if (i < 0 || i >= this.length) return;

        const idx = i >>> 5;        // which 32-bit word
        const mask = 1 << (i & 31); // which bit inside that word

        this.arr[idx] ^= mask;      // XOR = toggle
    }
    print()
    {
        let out = "";
        for (let i = 0; i < this.length; i++)
        {
            out += (this.get(i) ? "true" : "false");
            if (i !== this.length - 1) out += " ";
        }
        console.log(out);
    }


    copy()
    {
        const newCopy = new BitArray(this.length);
        for (let j = 0; j < newCopy.length; j += 1)
        {
            newCopy.set(j, this.get(j));
        }
        newCopy.numPresses = this.numPresses;
        newCopy.buttonPresses = [...this.buttonPresses];
        return newCopy;
    }


    compare(other)
    {
        if (!(other instanceof BitArray)) return false;
        if (this.length !== other.length) return false;

        const a = this.arr;
        const b = other.arr;


        for (let i = 0; i < a.length; i++)
        {
            if (a[i] !== b[i]) return false;
        }

        return true;
    }

    pressButton(wiringSchematic)
    {
        for (let j = 0; j < wiringSchematic.length; j += 1)
        {
            this.toggle(wiringSchematic[j]);
        }
        this.numPresses += 1;
        this.buttonPresses.push(wiringSchematic);
    }
}

readFile(10, 1, function (r)
{

    let sum = 0;
    const startingPoint = performance.now();
    for (let unitIndex in r)
    {
        const unit = r[unitIndex];
        const match = unit.match(/\[(?<indicatorLightDiagram>.*)\](?<buttonWiringSchematics>.*)\{(?<joltageRequirements>.*)\}/);
        const goal = new BitArray(match.groups.indicatorLightDiagram.split("").map(x => x === "#" ? true : false));
        const buttonWiringSchematics = match.groups.buttonWiringSchematics.trim().split(" ").map(x => x.slice(1, -1).split(",").map(Number));
        const joltageRequirements = match.groups.joltageRequirements;

        let state = new BitArray(goal.length);

        const result = getButtonCombos(state, buttonWiringSchematics, goal);

        printTimeRemaining(startingPoint, unitIndex, r.length);
        sum += result;

    }
    console.log(sum);
    return;

});


function getButtonCombos(initialState, buttons, goal, maxPresses = 3)
{
    let best = Number.MAX_SAFE_INTEGER;
    let results = [];

    function pressButtons(state)
    {
        if (state.compare(goal))
        {
            if (state.numPresses < best)
            {
                results = [];
                best = state.numPresses;
            }
            if (state.numPresses === best)
            {
                results.push(state);
            }
            return;

        }
        else if (state.numPresses >= maxPresses || state.numPresses > best)
        {
            return;
        }

        for (const button of buttons)
        {
            const newState = state.copy();
            newState.pressButton(button);
            pressButtons(newState);
        }
    }

    pressButtons(initialState);
    if (best === Number.MAX_SAFE_INTEGER)
    {
        return getButtonCombos(initialState, buttons, goal, maxPresses + 1);
    }
    return best;
}

