const createCashCounter = () => {
    let cashBox = [
        { 50: 10 },
        { 20: 10 },
        { 10: 10 },
        { 5: 25 },
        { 2: 25 },
        { 1: 25 },
        { 0.5: 25 },
        { 0.2: 25 },
        { 0.1: 25 },
        { 0.05: 25 },
        { 0.02: 25 },
        { 0.01: 25 },
    ];
    
    return (price, paid) => {
        // Insufficient funds
        if (paid < price) {
            console.log('Paid amount is insufficient!');
            return "Paid amount is insufficient!"; 
        }

        // store difference between paid amount and price for later use
        let difference = paid - price;

        // calculate total amount left in cashBox
        const cashBoxTotal = cashBox.reduce((acc, currCompartment) => {
            // extract bill value
            const billValue = Number(Object.keys(currCompartment)[0]);
            // console.log(Object.keys(currCompartment)[0])

            // calculate total value of all bills in the compartment
            const compartmentAmount = currCompartment[billValue] * billValue;
            // console.log(billValue);
            // console.log(currCompartment[billValue])
            
            // add compartment value to accumulated total and return for next iteration
            return acc + compartmentAmount;
        }, 0);

        // Check whether there is enough money in the cash register
        if (cashBoxTotal < difference) {
            console.log('Insufficient funds in cashBox! Abort...');
            return "Insufficient funds in cashBox!";
        }


        /* ------------------ Add money into kassa  ------------------ */
        // Iterate over the bill compartments
        cashBox.forEach(compartment => {
            
            // Extract the bill or coin amount
            const billCoin = Number(Object.keys(compartment)[0]);
            // console.log(Object.keys(compartment)[0])

            // Add bills/coins to the compartment as long as possible
            while (paid >= billCoin) {
                // Add one bill/coin
                compartment[billCoin] += 1;

                // Decrease the paid amount by that bill/coin
                paid -= billCoin;
            }
        });

        // Change the client gets returned
        const change = [];

        // Iterate over the bill compartments
        cashBox.forEach(compartment => {
            
            // Extract the bill or coin amount
            const billCoin = Number(Object.keys(compartment)[0]);

            // Temporary bill compartment for change
            const billType = {
                [billCoin]: 0
            };

            // Add bills/coins to the compartment as long as possible
            while (difference >= billCoin) {
                // Remove one bill/coin
                compartment[billCoin] -= 1;
                // console.log(compartment[billCoin])

                // Add bill to temporary bill compartment
                billType[billCoin] += 1;
                // console.log(billType[billCoin])
                // Decrease difference by bill's value
                difference -= billCoin;
            }

            // If any bills were added, add this temporary compartment to change
            if (billType[billCoin] > 0) change.push(billType);
        });

        console.log('cashBox', cashBox);

        // return change to client
        console.log("Here's your change. Thanks for your visit and please come again.");
        return change;
    };
}

// create new cashCounter
const cashCounter = createCashCounter();

// test whether updates on cashBox persist
console.log(cashCounter(0, 50)); // change should be one 50 euro bill
console.log(cashCounter(1, 50)); // change should be one 2x20, 1x5, 2x2
console.log(cashCounter(100, 50)); // should return early
console.log(cashCounter(1, 5000000000)); 
console.log(cashCounter(12, 25)); // change should be one 1x10, 1x2, 1x1
console.log(cashCounter(9.05, 25)); // change should be one 1x10, 1x2, 1x1