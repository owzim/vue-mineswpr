<template>
    <button
        class="cell"
        :class="classes"
        @click.alt="flag"
        @click.right="flag"
        @click.left="click"
        >
        {{ cell.hasMine ? '•' : cell.mineNeighbors.length }}
    </button>
</template>

<script>

import Field from '@/core/Field';

export default {
    name: 'Cell',
    created() {},
    mounted() {},
    data() {
        return {};
    },
    computed: {
        classes() {
            const cell = this.cell;
            const classes = {
                'has-mine': cell.hasMine,
                'is-covered': cell.isCovered,
                'is-empty': !cell.mineNeighbors.length && !cell.hasMine,
                'is-special': cell.isSpecial,
                'is-wrong': cell.wrong,
                'is-exploded': cell.isExploded,
                'is-flagged': cell.isFlagged,
                'is-unknown': cell.isUnknown,
                'is-none': cell.isNone,
            };

            classes[`has-${cell.mineNeighbors.length}-mine-neighbors`] = true;

            return classes;
        }
    },
    methods: {
        flag(event) {
            event.preventDefault();
            const cell = this.cell;

            if (!cell.isCovered) {
                return;
            }

            cell.isflagging = true;

            // TODO: refactor
            switch(true) {
                case !cell.isFlagged && !cell.isUnknown:
                    cell.isFlagged = true;
                    cell.isNone = false;
                break;
                case cell.isFlagged:
                    cell.isFlagged = false;
                    cell.isUnknown = true;
                    cell.isNone = false;
                break;
                case cell.isUnknown:
                    cell.isUnknown = false;
                    cell.isNone = true;
                    cell.isflagging = false;
                break;
            }
        },
        click(event) {
            const cell = this.cell;

            // TODO: refactor
            if (this.gameOver || (cell.isflagging || !cell.isNone)) {
                cell.isflagging = false;
                return;
            }

            this.uncover(cell);

            if (cell.hasMine) {
                cell.isExploded = true;
                this.$emit('explode', cell);
                return;
            }

            cell.emptyChain = cell.emptyChain || Field.getEmptyChain(cell);

            cell.emptyChain.forEach(c => {
                this.uncover(c);
            });

            cell.isflagging = false;
        },
        uncover(cell) {
            cell.isCovered = false;
            this.$emit('uncover', cell);
        },
    },
    props: {
        cell: Object
    }
}
</script>

<style lang="scss" scoped>

$gap: 1px;
$size: 1.6rem;

.cell {
    $number-colors: (
        color(accent-secondary),
        color(foreground),
        color(danger),
        darken-color(danger, .2),
        darken-color(danger, .4),
        darken-color(danger, .6),
        darken-color(danger, .8),
    );

    position: relative;
    border: 0;
    border: $gap solid #ddd;
    border-radius: $gap * 1.5;
    padding: 0;
    width: $size;
    height: $size;
    background: #eee;
    line-height: $size;
    text-align: center;
    font-weight: 700;
    font-family: inherit;
    font-size: .8em;

    &:focus {
        outline: 0;
    }

    @for $i from 1 through length($number-colors) {
        $c: nth($number-colors, $i);

        &.has-#{$i}-mine-neighbors {
            color: $c;
        }
    }

    &.is-empty {
        text-indent: -9999px;
    }

    &.has-mine {
        color: color(foreground);
        font-weight: 700;

        &:not(.is-covered) {
            font-size: rem(20);
        }

        &.is-exploded {
            border-color: color(danger);

            background: color(danger);
            color: color(background);
        }
    }

    &::after {
        $size: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: $size;
        height: $size;
        content: '';
        background: color(accent-secondary);
        opacity: 0;
        text-indent: 0;
    }

    &.is-covered {
        border-color: darken-color(accent-secondary, .2);

        &:hover {
           opacity: .8;
        }

        &::after {
            opacity: 1;
            transition-property: none;
        }
    }

    &.is-unknown,
    &.is-flagged {
        border-color: darken-color(accent, .2);

        &::after {
            background: color(accent);
            color: color(background);
        }
    }

    &.is-flagged {

        &::after {
            content: '⚑';
        }

        &.has-mine {
            background: color(accent);
            color: color(background);
        }
    }

    &.is-unknown {

        &::after {
            color: color(foreground);
            content: '?';
        }
    }

    &.is-wrong {
        border-color: darken-color(danger, .2);

        &::after {
            background: color(danger);
        }
    }
}
</style>
