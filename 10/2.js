class MachineState
{
    constructor(length, initialJoltageState)
    {
        this.joltages = new Array(length);

        if (initialJoltageState?.length > 0)
        {
            this.joltages = [...initialJoltageState];
        }

        this.buttonPresses = [];
        this.numPresses = 0;
    }


    copy()
    {
        const newCopy = new MachineState(this.length);
        newCopy.joltages = [...this.joltages];
        newCopy.numPresses = this.numPresses;
        newCopy.buttonPresses = [...this.buttonPresses];
        return newCopy;
    }

    increment(index)
    {
        this.joltages[index] += 1;
    }

    key()
    {
        return this.joltages.join(".");
    }

    pressButton(wiringSchematic)
    {
        for (let j = 0; j < wiringSchematic.length; j += 1)
        {
            this.increment(wiringSchematic[j]);
        }
        this.numPresses += 1;
        this.buttonPresses.push(wiringSchematic);
    }

    compare(otherState)
    {
        function arraysEqual(a, b)
        {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;

            for (var i = 0; i < a.length; ++i)
            {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }

        return arraysEqual(this.joltages, otherState.joltages);
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
        const buttonWiringSchematics = match.groups.buttonWiringSchematics.trim().split(" ").map(x => x.slice(1, -1).split(",").map(Number));
        const joltageRequirements = match.groups.joltageRequirements.split(",").map(Number);

        const goal = new MachineState(joltageRequirements.length,
            joltageRequirements
        );

        const initialPosition = new MachineState(joltageRequirements.length, Array(joltageRequirements.length).fill(0));

        console.log(`# Analyzing ${+unitIndex + 1}/${r.length}`);
        const result = getButtonCombos(initialPosition, buttonWiringSchematics, goal, 50);

        if (result === Number.MAX_SAFE_INTEGER)
        {
            return;
        }

        printTimeRemaining(startingPoint, +unitIndex + 1, r.length);
        sum += result;
        console.log("# Best:", result);
    }
    console.log(sum, sum === 428);
    return;

});


function getButtonCombos(initialState, buttons, goal)
{
    const q = [initialState];
    let numPresses = 0;
    const visited = new Map();

    while (q.length > 0)
    {
        //grab state off top
        const state = q.shift();

        if (state.numPresses > numPresses)
        {
            numPresses = state.numPresses;
            console.log(numPresses, q.length);
        }


        //did i reach goal?
        if (state.compare(goal))
        {
            return state.numPresses;
        }



        //prune/memo
        const stateKey = state.key();
        if (visited.has(stateKey) && visited.get(stateKey) <= state.numPresses)
        {
            //we've been here before with a better number
            continue;
        }

        visited.set(stateKey, state.numPresses);


        //try all buttons and push to q

        for (const button of buttons)
        {
            const newState = state.copy();
            newState.pressButton(button);
            q.push(newState);
        }
    }
}

