'use strict';

const gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    gutil = require('gulp-util');

// Source folder configuration
const SRC_DIR = {};
SRC_DIR.root = './src/';
SRC_DIR.js = SRC_DIR.root + 'js/';
SRC_DIR.less = SRC_DIR.root + '/less/';

// Source file matchers, using respective directories
const SRC_FILES = {
    js: SRC_DIR.js + '**/*.js',
    less: SRC_DIR.less + '*.less'
};

// Output directories
const PUBLIC_DIR = {};
PUBLIC_DIR.root = './frontend/';
PUBLIC_DIR.js = PUBLIC_DIR.root + 'pub-assets/js/';
PUBLIC_DIR.css = PUBLIC_DIR.root + 'pub-assets/css/'; // Update this link, example: Y:/TestCMS/pub-assets/css/

gulp.task('scripts', () => {
    return gulp.src([SRC_DIR.js + 'site.js', SRC_DIR.js + 'plugins/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        })
        .pipe(
            babel({presets: ['babel-preset-es2015'].map(require.resolve)})
        )
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(PUBLIC_DIR.js))
});

gulp.task('libs', () => {
    return gulp.src([SRC_DIR.js + 'jquery-3.2.1.js', SRC_DIR.js + 'plugins/*.js'])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(PUBLIC_DIR.js))
        // .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        // .pipe(gulp.dest(PUBLIC_DIR.js))
});

gulp.task('less', () =>
    gulp.src([SRC_FILES.less, SRC_DIR.less + 'pages/*.less'])
        .pipe(less().on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(autoprefixer('last 3 versions', 'ie 9'))
        .pipe(gulp.dest(PUBLIC_DIR.css))
        // .pipe(minifyCSS({keepBreaks: false}))
        // .pipe(rename({ suffix: '.min' }))
        // .pipe(gulp.dest(PUBLIC_DIR.css))
);

gulp.task('clean', () => {
    return gulp.src(PUBLIC_DIR.css, {read: false})
        .pipe(clean());
});

gulp.task('webserver', () =>
    connect.server({
        root: PUBLIC_DIR.root,
        livereload: false,
        port: 2222,
        host: 'localhost'
    })
);

gulp.task('watch', () => {
    gulp.watch([SRC_DIR.less + '*.less'], ['less']);
});

gulp.task('server', ['watch', 'webserver']);
gulp.task('build', ['less', 'watch']);
gulp.task('default', ['clean'], () => { gulp.run(['build', 'server']); });
gulp.task('en', ['clean'], () => { gulp.run(['build', 'server']); });
