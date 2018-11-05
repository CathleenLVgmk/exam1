var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var url = require('url');
gulp.task('default', function() {
    return gulp.src('./src/scss/demo.scss')
        .pipe(sass())
        .pipe(clean())
        .pipe(gulp.dest('./src/dist'))
})
gulp.task('uglify', function() {
    return gulp.src('./src/js/demo.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./src/dist'))
})
gulp.task('watch', function() {
    return gulp.watch(['./src/scss/demo.scss', './src/js/demo.js'], gulp.series('default', 'uglify'));
})
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(webserver({
            port: 9999,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url, true).pathname;
                if (pathname == '/') {
                    res.end(fs.readFileSync('./src/demo.html'));
                } else {
                    if (path.extname(pathname)) { //文件
                        if (pathname == '/favicon.ico') {
                            return res.end();
                        } else {
                            res.end(fs.readFileSync(path.join('src', pathname)));
                        }
                    }
                }
            }
        }))
})
gulp.task('dev', gulp.series('default', 'uglify', 'server', 'watch'));