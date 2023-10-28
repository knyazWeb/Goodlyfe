const gulp = require('gulp');
// HTML
const fileInclude  = require('gulp-file-include'); 
const htmlclean = require('gulp-htmlclean');
const webphtml = require('gulp-webp-html');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer =  require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpcss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fileSystem = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
// IMAGES
const imagemin = require('gulp-imagemin');
//const webp = require('gulp-webp');


const changed = require('gulp-changed');
const groupMedia = require('gulp-group-css-media-queries');



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


// Clear Docs Folder
gulp.task('clean:docs', (done) => {
    if (fileSystem.existsSync('./docs/')) {
        return gulp.src('./docs/', {read: false}).pipe(clean({force: true}));
    }
    done();
});

// HTML
gulp.task('html:docs', () => {
    return gulp.src('./src/html/**/*.html', '!./src/html/blocks/*.html')
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        //.pipe(webphtml())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});

// SCSS 
gulp.task('sass:docs', () => {
    return (
        gulp
            .src("./src/scss/*.scss")
            .pipe(changed("./docs/css/"))
            .pipe(plumber(plumberNotify("SCSS")))
            .pipe(sourceMaps.init())
            .pipe(sassGlob())
            //.pipe(webpcss())
            .pipe(groupMedia())
            .pipe(sass())
            .pipe(csso())
            .pipe(autoprefixer())
            .pipe(sourceMaps.write())
            .pipe(gulp.dest("./docs/css/"))
    );
});

// Copy Images
gulp.task('images:docs', () => {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        //.pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./docs/img/'))
});
 
// Copy fonts
gulp.task('fonts:docs', () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
});

// Copy files
gulp.task('files:docs', () => {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'))
});

// JS
gulp.task('js:docs', () => {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest('./docs/js'))
});

// Server Live Reload
gulp.task('server:docs', () => {
    return gulp.src('./docs/')
        .pipe(server(startServerSettings))
});



