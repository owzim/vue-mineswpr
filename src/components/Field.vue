<template>
    <div class="field" @click.middle="start" :class="classes">

        <nav class="field__nav">

            <select class="field__nav-item" v-model="selectedPlayfieldOptions" @change="start">
                <option :disabled="item === null" v-for="(item, label) in fieldOptions" :key="label" :value="item">{{ label }} Mines</option>
            </select>

            <button class="field__nav-item" @click="start">Restart!</button>

            <span class="field__nav-item field__info" v-if="field.save">
                {{ secondsPassed | time }}
            </span>
        </nav>

        <div class="field__matrix matrix" :class="classes" @click.right.prevent>
            <div class="matrix__row" v-for="(row, i) in field.matrix" :key="i">
                <Cell
                    class="matrix__cell"
                    v-for="(cell, j) in row" :key="j" :cell="cell"
                    @uncover="onUncover"
                    @explode="onExplode"
                />
            </div>
        </div>

        <div class="finished">
            <span v-show="matchState.isFinished && !matchState.hasLost" class="finished__phrase has-won">Hell yeah! ... {{ secondsPassed | time }}</span>
            <span v-show="matchState.isFinished && matchState.hasLost" class="finished__phrase has-lost">Frick on a stick!</span>
        </div>
    </div>
</template>

<script>

import Field from '@/core/Field';
import Timer from '@/core/Timer';

const CONFIG = {
    matrix: {
        default: 0,
        selects: {
            'I’m too young to die: 9x9, 10': [9, 10],
            'Hey, not too rough: 16x16, 40': [16, 40],
            'Hurt me plenty: 32x32, 200': [32, 200],
            'Ultra-Violence: 32x32, 400': [32, 400],
            'Nightmare!: 32x32, 1024': null,
        },
        getDefault() {
            return this.selects[Object.keys(this.selects)[this.default]];
        },
    },
};

export default {
    name: 'Field',
    created() {
        this.matchTimer = {
            start: 0,
            id: 0,
        };
        this.timer = Timer.create({ immediate: true, delay: 1000, callback: ({ delta }) => {
            this.secondsPassed = delta;
        } });
        this.fieldOptions = CONFIG.matrix.selects;
    },
    mounted() {
        this.start();
    },
    data() {

        return {
            selectedPlayfieldOptions: CONFIG.matrix.getDefault(),
            field: {},
            matchState: {
                hasLost: false,
                isFinished: false,
            },
            uncovered: [],
            secondsPassed: 0,
        }
    },
    computed: {
        classes() {
            return {
                'has-lost': this.matchState.hasLost,
                'has-won': this.matchState.isFinished && !this.matchState.hasLost,
                'is-finished': this.matchState.isFinished,
            }
        },
    },
    methods: {
        start() {
            const [size, minesCount] = this.selectedPlayfieldOptions;

            this.timer.stop();
            this.secondsPassed = 0;
            this.field = Field.create(size, minesCount);
            this.matchState.hasLost = false;
            this.matchState.isFinished = false;
            this.uncovered.length = 0;
        },
        onExplode(cell) {
            this.die();
        },
        onUncover(cell) {

            if (this.uncovered.indexOf(cell) === -1) {

                if (this.uncovered.length === 0) {
                    this.timer.start();
                }

                this.uncovered.push(cell);
            }

            if (this.uncovered.length === this.field.save.length) {
                this.win();
            }
        },
        updateSecondsPassed() {
            this.secondsPassed = Date.now() - this.matchTimer.start;
        },
        win() {
            this.finish();
        },
        die() {
            this.finish();
            this.matchState.hasLost = true;
            this.field.mines.forEach(mine => {
                mine.isCovered = false;
            });
            this.field.all.forEach(field => {
                field.wrong = !field.hasMine && field.isFlagged;
            });
        },
        finish() {
            this.matchState.isFinished = true;
            this.timer.stop();
        }
    }
}
</script>


<style scoped lang="scss">

$gap: 1px;

.field {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;

    &__info {
        color: color(accent-secondary);
    }

    &__nav {
        display: flex;
        margin-bottom: rem(24);
        align-items: center;
        flex-direction: row;
        justify-content: center;

        &-item {

            & + & {
                margin-left: rem(6);
            }
        }
    }
}

.matrix {
    position: relative;
    border: rem(1) solid color(foreground);
    padding: rem(6);
    box-shadow: 0 0 0 rem(6) faint-color(accent-secondary, .8);

    &.is-finished {

        &:after {
            @extend %pseudo;
        }
    }

    &__row {
        display: flex;

        & + & {
            margin-top: $gap;
        }
    }

    &__cell {
        $size: rem(24);
        width: $size;
        height: $size;
        flex-grow: 0;
        flex-shrink: 0;
        overflow: hidden;

        & + & {
            margin-left: $gap;
        }
    }

    &.has-won {
        box-shadow: 0 0 0 rem(6) color(accent);
    }

    &.has-lost {
        box-shadow: 0 0 0 rem(6) color(danger);
    }
}

.finished {
    margin-top: size(small);

    &__phrase {
        padding: rem(4) rem(8);
        text-align: center;
        font-weight: 700;
        transform: translateY(rem(6));
        color: color(accent);

        &.has-lost {
            color: color(danger);
        }
    }
}

</style>
