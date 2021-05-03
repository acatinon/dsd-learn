const Idyll = require('idyll');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const fs = require('fs');

var idyll = Idyll({
  inputFile: 'index.idyll',
  live: (process.argv[2] == "--watch")
});

idyll.build()
  .on('update', () => {
    fs.readFile('src/app.css', (err, css) => {
      postcss([tailwind, autoprefixer])
        .process(css, { from: 'styles.css', to: 'dest/app.css' })
        .then(result => {
          fs.writeFile('build/styles.css', result.css, () => true)
          if (result.map) {
            fs.writeFile('dest/styles.css.map', result.map.toString(), () => true)
          }
        })
    })
  });
