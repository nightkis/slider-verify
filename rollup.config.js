import terser from '@rollup/plugin-terser'

export default {
    input: 'src/main.js',
    output: [{
        file: 'dist/sverify.es.js',
        format: 'es'
    }, {
        file: 'dist/sverify.umd.js',
        format: 'umd',
        name: 'sverify'
    }, {
        file: 'dist/sverify.min.js',
        format: 'umd',
        name: 'sverify',
        plugins: [terser({maxWorkers: 4})]
    }]
}