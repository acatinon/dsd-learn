const Idyll = require('idyll');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const fs = require('fs');

var idyll = Idyll({
  inputFile: 'index.idyll',
  template: "main.html",
});



idyll.build()
  .on('update', () => {
    fs.readFile('styles.css', (err, css) => {
      postcss([tailwind, autoprefixer])
        .process(css, { from: 'styles.css', to: 'build/static/main.css' })
        .then(result => {
          fs.writeFile('build/static/main.css', result.css, () => true)
          if (result.map) {
            fs.writeFile('build/static/main.css.map', result.map.toString(), () => true)
          }
        })
    })
  });
