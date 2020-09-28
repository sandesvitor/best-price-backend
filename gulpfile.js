const { series } = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

function appJS() {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            comments: false,
            presets: ["env"]
        }))
        .on('error', err => console.log("erro: " + e))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist'))
}

module.exports.default = series(appJS)