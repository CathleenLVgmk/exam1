//引入模块
var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var url = require('url');
//任务default：编译scss，并压缩css输出到服务器文件夹中
gulp.task('default', function() {
    return gulp.src('./src/scss/demo.scss')
        .pipe(sass())
        .pipe(clean())
        .pipe(gulp.dest('./src/dist'))
});
//任务uglify：将es6转为es5，并将js文件压缩输出到服务器目录（dist）
gulp.task('uglify', function() {
    return gulp.src('./src/js/demo.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./src/dist'))
});
//任务watch,监听任务defult 和uglify
gulp.task('watch', function() {
    return gulp.watch(['./src/scss/demo.scss', './src/js/demo.js'], gulp.series('default', 'uglify'));
});
//任务server:搭建服务器
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