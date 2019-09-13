'use strict';

const {task, watch, src, dest, parallel, series} = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ip = require('ip');

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

task('scripts', () => {
    return src([SRC_DIR.js + 'site.js', SRC_DIR.js + 'plugins/*.js'])
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
        .pipe(dest(PUBLIC_DIR.js))
});

task('libs', () => {
    return src([SRC_DIR.js + 'jquery-3.2.1.js', SRC_DIR.js + 'plugins/*.js'])
        .pipe(concat('libs.js'))
        .pipe(dest(PUBLIC_DIR.js))
        // .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        // .pipe(dest(PUBLIC_DIR.js))
});

task('less', () =>
    src([SRC_FILES.less, SRC_DIR.less + 'pages/*.less'])
        .pipe(less().on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(autoprefixer('last 3 versions', 'ie 9'))
        .pipe(dest(PUBLIC_DIR.css))
        // .pipe(minifyCSS({keepBreaks: false}))
        // .pipe(rename({ suffix: '.min' }))
        // .pipe(dest(PUBLIC_DIR.css))
);

task('clean', () => {
    return src(PUBLIC_DIR.css, {read: false})
        .pipe(clean());
});

task('webserver', (done) => {
    src(PUBLIC_DIR.root)
    .pipe(webserver({
        host: ip.address(),
        port: process.env.PORT || 3000,
        directoryListing: true,
        open: '/index.html',
        fallback: '/index.html'
    }));
    done();
});

task('watch', () => {
});
task('watch', (done) => {
    watch([SRC_DIR.less + '*.less'], series('less'));
    done();
});
task('build',
    parallel('less', 'watch')
);
task('default',
    series('clean', 'build', 'webserver')
);
