const gulp = require('gulp')
const sass = require('gulp-sass')
const autoPrefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync')

let config = {
  src: './scss/**/*.scss',
  dest: './public/stylesheets',
  bsConfig: {
    server: {
      baseDir: './views/'
    } ,
    port: 8000,
    open: true,
    notify: true
  }
}


gulp.task('sass' , () =>
  gulp.src(config.src)
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoPrefixer())
    .pipe(gulp.dest(config.dest))
)

gulp.task('serve' , () => {
  browserSync.init(config.bsConfig)
})

gulp.task('build' , () =>{
  return gulp.src(config.src)
            .pipe(sass({outputStyle: 'expanded'}))
            .pipe(autoPrefixer())
            .pipe(gulp.dest(config.dest))
})

gulp.task('watch' , () => {
  gulp.watch(config.src , ['sass'])
  // gulp.watch('./views/**/*.ejs').on('change' , browserSync.reload)
  // gulp.watch('./public/stylesheets/**/*.css').on('change' , browserSync.reload)
})

gulp.task('default' , ['sass' , 'watch'])
