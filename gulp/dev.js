const gulp = require('gulp');
const fileInclude  = require('gulp-file-include'); 
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fileSystem = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const watch = require('gulp-watch');




const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            tittle: 'Styles',
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
}
const startServerSettings = {
    livereload: true,
    open: true
}


// Clear Build Folder
gulp.task('clean:dev', (done) => {
    if (fileSystem.existsSync('./build/')) {
        return gulp.src('./build/', {read: false}).pipe(clean({force: true}));
    }
    done();
});

// Include Files
gulp.task('html:dev', () => {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(gulp.dest('./build/'))
});

// SCSS Reload
gulp.task('sass:dev', () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
});

// Copy Images
gulp.task('images:dev', () => {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./build/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./build/img/'))
});
 
// Copy fonts
gulp.task('fonts:dev', () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
});

// Copy files
gulp.task('files:dev', () => {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'))
});

//
gulp.task('js:dev', () => {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberNotify('JS')))
        //.pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./build/js'))
});

// Server Live Reload
gulp.task('server:dev', () => {
    return gulp.src('./build/')
        .pipe(server(startServerSettings))
});

// Watch files' changes
gulp.task('watch:dev', () => {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
    gulp.watch('./src/js/**/*', gulp.parallel('js:dev'));
    //watch('./src/**/*', function(obj){
    //    if(obj.event === 'unlink'){
    //            return gulp.series(
    //                'clean:dev',
    //                gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'files:dev', 'js:dev'))()
    //    }
    //    return 
    //})
});
