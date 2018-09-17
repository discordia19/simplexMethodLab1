const SimplexMethod = require('./SimplexMethod.js');

const SIMPLEX_TABLE = [
    [5, 3, 1, 1],
    [2, 1, 1, 0],
    [6, 0, 0.5, 4],
    [0, 7, -4, -3]
];
const SIMPLEX_TABLE_2 = 1;
const SIMPLEX_TABLE_3 = [
    [2, 1, -2],
    [-2, -2, 1],
    [5, 1, 1],
    [0, 1, -1]
];

let myVariant = new SimplexMethod(SIMPLEX_TABLE_3);
if (myVariant.error) {
    console.log('error occured');
    return 1;
}

myVariant.optimize();