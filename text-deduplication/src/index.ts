import {h, Ref, resolveComponent} from 'vue';

const example = `He3
He3`
export default () => h(resolveComponent('h-transform'),{
    onMounted: (input: Ref<string>) => {
        input.value = example
    },
    onChange: (inputValue: Ref<string>) => {
        if (!inputValue.value) return ''
        return [...new Set(inputValue.value.split('\n'))].join('\n')
    }
})

