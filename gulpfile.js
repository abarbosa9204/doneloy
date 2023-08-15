var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var NwBuilder = require('nw-builder');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var jsfuck = require('gulp-jsfuck');

var paths = {
   sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','sass-admin']);

gulp.task('sass', function (done) {
   gulp.src('./scss/front/*.scss')
     .pipe(sass({
         errLogToConsole: true
     }))
     .pipe(gulp.dest('./html/css/'))
     .pipe(minifyCss({keepSpecialComments: 0 }))
     .pipe(rename({ extname: '.min.css' }))
     .pipe(gulp.dest('./html/css/'))
     .on('end', done);
});

gulp.task('sass-admin', function (done) {
    gulp.src('./scss/admin/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./html/css/admin/'))
        .pipe(minifyCss({keepSpecialComments: 0 }))
        //.pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./html/css/admin/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.sass, ['sass-admin']);
});

gulp.task('build', function () {
    var nw = new NwBuilder({
        files: 'www/**', // use the glob format
        platforms: ['osx32', 'osx64', 'win32', 'win64'] ,
        buildDir: 'build',
        winIco: 'logo.png'
    });
    nw.on('log',  console.log);
    // Build returns a promise
    nw.build().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
});

gulp.task('scripts', function() {
    
    gulp.src(
        [
            'www/lib/slick-carousel/slick/slick.css', 
            'www/lib/slick-carousel/slick/slick-theme.css', 
            'www/css/style.css'
            
        ]
    )
    .pipe(concat('all.css'))
    .pipe(minifyCss({
         keepSpecialComments: 0
     }))
    .pipe(gulp.dest('www/dist/'));
    
    return gulp.src(
        [
            
            'www/js/datos.js',
            'www/js/empresarios.js',
            'www/lib/jquery/dist/jquery.js', 
            'www/lib/gsap/src/minified/TweenMax.min.js', 
            'www/lib/gsap/src/minified/TimeLineMax.min.js',
            'www/lib/gsap/src/minified/utils/Draggable.min.js',
            'www/lib/slick-carousel/slick/slick.js',
            'www/lib/angular/angular.min.js',
            'www/js/utils.js',
            'www/js/controllers.js'
            
        ]
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(strip())
    .pipe(gulp.dest('www/dist/'));
});