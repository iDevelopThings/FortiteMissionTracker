let mix           = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix
  .setPublicPath('public')
  .js('resources/vue/app.js', 'public/js')
  .sass('resources/scss/app.scss', 'public/css')
  .options({
    processCssUrls : false,
    postCss        : [tailwindcss('./tailwind.config.js')],
  })
//	.browserSync()
;
