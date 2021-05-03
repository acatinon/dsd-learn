const Idyll = require('idyll');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const fs = require('fs');

var idyll = Idyll({
  inputFile: 'index.idyll',
  watch: (process.argv[2] == "--watch")
});



idyll.build()
  .on('update', () => {
    fs.readFile('styles.css', (err, css) => {
      postcss([tailwind, autoprefixer])
        .process(css, { from: 'styles.css', to: 'build/static/idyll_styles.css' })
        .then(result => {
          fs.writeFile('build/static/idyll_styles.css', result.css, () => true)
          if (result.map) {
            fs.writeFile('build/static/idyll_styles.css.map', result.map.toString(), () => true)
          }
        })
    })
  });
