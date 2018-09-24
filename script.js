const SimplexMethod = require('./SimplexMethod.js');
const fs = require('fs');

const fileContentVariant17 = fs.readFileSync("var.txt", "utf-8");
const fileContentVariantSem = fs.readFileSync("var2.txt", "utf-8");

const initialValues17 = JSON.parse(fileContentVariant17);
const initialValuesSem = JSON.parse(fileContentVariantSem);


let myVariant = new SimplexMethod(initialValues17);
let semVariant = new SimplexMethod(initialValuesSem);

myVariant.optimize();

console.log('--------------------');

semVariant.optimize();


/*

const SIMPLEX_TABLE = [
    [5, 3, 1, 1],
    [2, 1, 1, 0],
    [6, 0, 0.5, 4],
    [0, 7, 4, 3]
];
const var_sem = [
    [2,1,-2],
    [-2,-2,1],
    [5,1,1],
    [0,1,-1]
]
const variant_17 = {
    "simplexTable": [
        [5, 3, 1, 1],
        [2, 1, 1, 0],
        [6, 0, 0.5, 4],
        [0, 7, 4, 3]
    ],
    "freeValues":  ['X1', 'X2', 'X3'],
    "baseValues":  ['X4', 'X5', 'X6']
};

*/