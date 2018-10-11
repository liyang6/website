global.dataPath={
	root:"./"
};

var fs=require("fs"),
    gulp=require('gulp'),
    rimraf = require('rimraf'),
    plugins = require('gulp-load-plugins')();
const path = require('path');
const babel = require('gulp-babel');

var outputDir='dist';
var output=global.dataPath.root+'/'+outputDir;

gulp.task('connect', function () {
    plugins.connect.server({
        name: 'website',
        root: global.dataPath.root,
/*        host: "127.0.0.1",*/
        port: 8088,
        livereload: true
    });
});

gulp.task('delDist', function (cb) {
    return rimraf(output, cb);
});
// 压缩 PC 目录 html
gulp.task('minify_html', function () {
    return gulp.src([global.dataPath.root+'/**/*.html', "!"+global.dataPath.root+'/template/*.html'],{
            base:global.dataPath.root
        })
        .pipe(plugins.htmlclean())
        .pipe(plugins.htmlmin({
            removeComments: true,
            collapseWhitespace:true,
            minifyJS: false,
            minifyCSS: true,
            minifyURLs: true
        }))
        .pipe(gulp.dest(output))
});
// 压缩 PC 目录 css
gulp.task('minify_css', function () {
    return gulp.src([global.dataPath.root+'/**/*.css'],{
            base: global.dataPath.root 
        })
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(output));
});
// 压缩 PC js 目录 js
gulp.task('minify_js', function () {
    return gulp.src([global.dataPath.root+'/**/*.js'],{
            base: global.dataPath.root 
        })
        .pipe(babel({
            "presets": ['@babel/env']
        }))
        .pipe(plugins.uglify())
        .on('error', function (err) {
            plugins.util.log(plugins.util.colors.red('[Error]'), err.toString());
        }) 
        .pipe(gulp.dest(output));
});
// 拷贝图片至相对应的目录
gulp.task('copy_file', function () {
    return gulp.src([global.dataPath.root+'/**/*.ico',global.dataPath.root+'/images/*.*',global.dataPath.root+'/images/**/*.*',global.dataPath.root+'/data/*.*'],{
            base: global.dataPath.root 
        })
        .pipe(gulp.dest(output));
});

// 异步同步执行
gulp.task('build', function (cb) {
    plugins.sequence('delDist', ['minify_html', 'minify_css', 'minify_js', 'copy_file'], cb)
});

/*默认*/
gulp.task('default',function() {
  // 将你的默认的任务代码放在这
 	gulp.start('connect'); 
});

