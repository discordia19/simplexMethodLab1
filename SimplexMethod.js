class SimplexMethod {
    constructor(simplexTable) {
        if (!SimplexMethod.checkTable(simplexTable)) {
            console.error('can\'t construct Simplex Table, argument is incorrect');
            return {
                error: 1
            };
        }

        this.table = simplexTable;
        this.freeValues = ['X1', 'X2'];
        // this.freeValuesAmount = this.freeValues.length;
        this.baseValues = ['X3', 'X4', 'X5'];
        // this.baseValuesAmount = this.baseValues.length;
        this.iteration = 0;
        this.noSolutionFlag = false;
    }

    get freeValuesAmount() {
        return this.freeValues.length;
    }

    get baseValuesAmount() {
        return this.baseValues.length;
    }

    showStat() {
        console.log(`Симплекс таблица имеет вид: ${this.toString()} \nБазисные аргументы: ${this.baseValues}, Свободные аргументы: ${this.freeValues}`);
    }

    static checkTable(simplexTable) {
        return (simplexTable instanceof Array);
    }

    set simplexTable(table) {
        this.table = table;
    }

    get simplexTable() {
        return this.table;
    }

    toString() {
        return this.simplexTable.reduce((allStrings, currentString) => {
            return (allStrings + `\n ${currentString}`)
        }, '');
    }

    findKfirstPart() {
        console.log('ищем K-столбец');

        for (let str = 0; str < this.baseValuesAmount; str++) {
            if (this.simplexTable[str][0] < 0) {
                for (let index = 1; index < this.freeValuesAmount; index++) {
                    if (this.simplexTable[str][index] < 0) {
                        return index; // разршающий столбец
                    }
                }

                return null; // задача не имеет допустимых решений
            }
        }

        return null;
    }

    findKsecondPart() {
        console.log('Поиск разрешающего столбца K.');

        for (let index = 1; index < this.simplexTable[0].length; index++) {
            if (this.simplexTable[this.simplexTable.length - 1][index] > 0) {
                for (let string = 0; string < this.baseValuesAmount; string++) {
                    if (this.simplexTable[string][index] > 0) {
                        return index;
                    }
                }
                // нет оптимального
                return null;
            }
        }

        return null;
    }

    findR(k) {
        console.log('Поиск разрешающей строки R.')
        let r = null;
        let min = undefined;

        for (let str = 0; str < this.baseValuesAmount; str++) {
            let current = this.simplexTable[str][0] / this.simplexTable[str][k];
            if (min !== undefined) {
                if (current > 0 && current < min) {
                    min = current;
                    r = str;
                }

                continue;
            }

            if (current > 0) {
                min = current;
                r = str;
            }
        }

        return r;
    }

    /**
     * 
     * @param {Function} param в зависимости от значения параметра выполняется: 1 - поиск допустимого, 0 - поиск оптимального решений
     */
    makeOptimizationStep(param) {
        if (param ? (!this.isAcceptable()) : (!this.isOptimal())) {
            if (param) {
                console.log('Поиск допустимого решения, R и K')
            } else {
                console.log('Поиск оптимального решения, R и K')
            }

            do {
                // ищем разрешающие  столбец затем строку
                let k = (param ? this.findKfirstPart() : this.findKsecondPart());

                if (k === null) {
                    if (param) {
                        console.log('Задача не имеет допустимых решений!');
                    } else {
                        console.log('Задача не имеет оптимального решения!');
                    }

                    return null;
                }

                // ищем разрешающую строку
                let r = this.findR(k);

                console.log(`Столбец ${k}, строка ${r}, разрешающее значение ${this.simplexTable[r][k]}`);

                this.calculateGeordane(r, k); // выполняем Жордановы преобразования
                this.showStat();
            } while (param ? (!this.isAcceptable()) : (!this.isOptimal()))
        }    
    }

    optimize() {
        console.log('Начинаем оптимизацию...');
        this.showStat();
        
        this.makeOptimizationStep(1); // поиск допустимого решения.
        this.makeOptimizationStep(0); // поиск оптимального решения

        // if (!this.isAcceptable()) {
        //     console.log('Поиск допустимого решения, R и K')
        //     do {
        //         // ищем разрешающие столбец затем строку
        //         let k = this.findKfirstPart();
        //         if (k === null) {
        //                 colsole.log('Задача не имеет допустимых решений!');
        //                 return null;
        //             }
                    
        //             // ищем разрешающую строку
        //             let r = this.findR(k);

        //             console.log(`Столбец ${k}, строка ${r}, разрешающее значение ${this.simplexTable[r][k]}`);
                    
        //             this.calculateGeordane(r, k); // выполняем Жордановы преобразования
        //         this.showStat();
        //     } while (!this.isAcceptable())
        // }
        
        // допустимое решение найдено.

        // if (!this.isOptimal()) {
        //     console.log('Поиск оптимального решения...');
        //     do {
        //         let k = this.findKsecondPart();
        //         if (k === null) {
        //             console.log('Нет оптимального решения!');
        //             return null;
        //         }
        //         console.log(`Значение столбца K = ${k}`);

        //         let r = this.findR(k);

        //         console.log(`Столбец ${k}, строка ${r}, разрешающее значение ${this.simplexTable[r][k]}`);

        //         this.calculateGeordane(r, k);
        //         this.showStat();
        //     } while (!this.isOptimal())
        // }

        console.log('Оптимальное решение найдено!');
        console.log(`Оптимизация выполнена за ${this.iteration} итераций!\n`);
        return 0;
    }

    isAcceptable() {
        for (let str = 0; str < this.baseValuesAmount; str++) {
            if (this.simplexTable[str][0] < 0) {
                return false;
            }
        }

        return true;
    }

    isOptimal() {
        return this.simplexTable[this.simplexTable.length - 1].every((element, index) => (element < 0 || index == 0));
    }

    /**
     * Проводит преобразования Жодрдана над this.table
     * @param {number} r - разрешающая строка
     * @param {number} k - разрешающий столбец
     */
    calculateGeordane(r, k) {
        let newSimplexTable = this.simplexTable.slice()
            .map((element) => (element.slice()));

        // обмен переменных
        let oldBasis = this.baseValues[r];
        this.baseValues[r] = this.freeValues[k - 1];
        this.freeValues[k - 1] = oldBasis;

        for (let string = 0; string < this.simplexTable.length; string++) {
            for (let column = 0; column < this.simplexTable[string].length; column++) {
                if (string == r && column == k) {
                    newSimplexTable[string][column] = 1 / this.simplexTable[string][column];
                } else if (string == r && column != k) {
                    newSimplexTable[string][column] = this.simplexTable[r][column] / this.simplexTable[r][k];
                } else if (string != r && column == k) {
                    newSimplexTable[string][column] = -(this.simplexTable[string][k] / this.simplexTable[r][k]);
                    // console.log(`str ${string}, col: ${column}, val: ${newSimplexTable[string][column]}`);
                } else if (string != r && column != k) {
                    newSimplexTable[string][column] = this.simplexTable[string][column] -
                        (this.simplexTable[string][k] * this.simplexTable[r][column] / this.simplexTable[r][k]);
                    // console.log(`str ${string}, col: ${column}, val: ${newSimplexTable[string][column]}`);
                }
            }
        }

        this.simplexTable = newSimplexTable;
        this.iteration++;
    }
}

module.exports = SimplexMethod;