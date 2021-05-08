const Idyll = require('idyll');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const fs = require('fs');
const chokidar = require('chokidar');

var idyll = Idyll({
  inputFile: 'index.idyll',
  watch: true
});

var watchingCss = false;

idyll
  .build()
  .on('update', () => {
    if (!watchingCss) {
      watchingCss = true;
      chokidar.watch('styles.css').on('all', (event, path) => {
        fs.readFile('styles.css', (err, css) => {
          postcss([tailwind, autoprefixer])
            .process(css, { from: 'styles.css', to: 'build/static/idyll_styles.css' })
            .then(result => {
              fs.writeFile('build/static/idyll_styles.css', result.css, () => true)
              console.log("styles.css updated")
              if (result.map) {
                fs.writeFile('build/static/idyll_styles.css.map', result.map.toString(), () => true)
              }
            })
        })
      });
    }
  });


