<template>
    <div id="app" class="app">
        <h1 class="logo">
            <img class="logo__image" src="./assets/3ogo.png" alt="">
            <span class="logo__syllable-1">mine</span>
            <span class="logo__syllable-2">swpr</span>
        </h1>
        <Field class="field" />

        <p class="controls">
            Mouse left: <strong>uncover</strong>,
            middle: <strong>restart</strong>,
            right: <strong>flag</strong>
        </p>

        <ForkMe class="fork-me" :size="60" url="https://github.com/owzim/vue-mineswpr" />
    </div>
</template>

<style lang="scss">

@import 'scss/styles';

.fork-me {
    position: absolute;
    top: 0;
    right: 0;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: color(foreground);
}

.logo {

    &__image {
        margin-right: rem(10);
        height: rem(40);
        vertical-align: middle;
    }

    &__syllable-1 {
        color: color(accent);
        font-weight: 700;
    }

    &__syllable-2 {
        font-weight: 400;
    }
}

.controls {

    strong {
        color: color(accent);
    }
}

</style>
