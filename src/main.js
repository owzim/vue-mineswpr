import Vue from 'vue';
import App from '@/App.vue';
Vue.config.productionTip = false;

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import filters from '@/core/filters.js';

Object.keys(filters).forEach(name => {
    Vue.filter(name, filters[name]);
});

const requireComponent = require.context(
    './components',
    false,
    /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
    const component = requireComponent(fileName);
    const name = upperFirst(
        camelCase(
            fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
        )
    );

    Vue.component(
        name,
        component.default || component
    );
});

new Vue({
    render: h => h(App)
}).$mount('#app');
