import random_ from 'lodash/random';

const BASE_FIELD = {
    hasMine: false,
    isSteppedOn: false,
    isCovered: true,
    isFlagged: false,
    isUnknown: false,
    isNone: true,
    flagging: false,
    wrong: false,
};

function getField(matrix) {
    return function(rowIndex, colIndex) {
        if (matrix[rowIndex] && matrix[rowIndex][colIndex]) {
            return matrix[rowIndex][colIndex];
        }
        return null;
    };
}

function getEmptyChain(field, chain = []) {

    if (field.isEmpty && chain.indexOf(field) === -1) {
        chain.push(field);
        field.emptyNeighbors.forEach(neighbor => {
            if (neighbor.emptyNeighbors.length) {
                getEmptyChain(neighbor, chain);
            }
        });
    }

    chain.forEach(field => {
        if (field.isEmpty) {
            field.neighbors.forEach(neighbor => {
                if (!neighbor.hasMine && neighbor.mineNeighbors.length && chain.indexOf(neighbor) === -1) {
                    chain.push(neighbor);
                }
            });
        }
    });

    return chain;
}

function eachMatrix(matrix, callback) {
    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];

        for (let j = 0; j < row.length; j++) {
            let result = callback(row[j], i, j);

            if (result !== null && typeof result !== 'undefined') {
                row[j] = result;
            }
        }
    }
}

const Matrix = {
    each: eachMatrix,
    getEmptyChain,
    create(size, minesCount) {
        const matrix = [];
        const mines = [];
        const all = [];
        const random = () => {
            return random_(0, size - 1);
        };

        for (let i = 0; i < size; i++) {
            let row = [];

            for (let j = 0; j < size; j++) {
                let item = { ...BASE_FIELD };

                row.push(item);
                all.push(item);
            }

            matrix.push(row);
        }

        (function applyMines(currentCount = 0) {
            const item = matrix[random()][random()];

            if (currentCount < minesCount) {
                if (item.hasMine) {
                    applyMines(currentCount);
                } else {
                    item.hasMine = true;
                    mines.push(item);
                    applyMines(currentCount + 1);
                }
            }
        }());

        (function applyAdditionalData() {
            const gf = getField(matrix);

            eachMatrix(matrix, (field, rowIndex, colIndex) => {

                field.neighbors = [
                    gf(rowIndex - 1, colIndex),
                    gf(rowIndex - 1, colIndex + 1),
                    gf(rowIndex, colIndex + 1),
                    gf(rowIndex + 1, colIndex + 1),
                    gf(rowIndex + 1, colIndex),
                    gf(rowIndex + 1, colIndex - 1),
                    gf(rowIndex, colIndex - 1),
                    gf(rowIndex - 1, colIndex - 1),
                ].filter(field => {
                    return Boolean(field);
                });

                field.mineNeighbors = field.neighbors.filter(field => {
                    return field.hasMine;
                });
            });

            all.forEach(field => {

                field.emptyNeighbors = field.neighbors.filter(field => {
                    return field.mineNeighbors.length === 0;
                });

                field.nonMineNeighbors = field.neighbors.filter(field => {
                    return !field.hasMine;
                });

                field.isEmpty = field.mineNeighbors.length === 0;
            });

            // eachMatrix(matrix, (field) );
        }());

        return {
            matrix,
            mines,
            all,
            save: all.filter(i => !i.hasMine),
        };
    }
};

export default Matrix;
