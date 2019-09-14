'use strict';

const {task, watch, src, dest, parallel, series} = require('gulp'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver'),
    gutil = require('gulp-util'),
    ip = require('ip');

// Source folder configuration
const SRC = {};
SRC.root = './src/';
SRC.less = SRC.root + 'less/';

// Source file matchers, using respective directories
const FILES = {
    less: [SRC.less + '*.less', SRC.less + 'pages/*.less']
};

// Output directories
const PUB = {};
PUB.root = './frontend/';
PUB.css = PUB.root + 'pub-assets/css/';

task('less', () =>
    src(FILES.less)
        .pipe(less().on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(dest(PUB.css))
        // .pipe(cssmin())
        // .pipe(rename({suffix: '.min'}))
        // .pipe(dest(PUB.css))
);

task('watch', (done) => {
    watch([SRC.less + '*.less', SRC.less + '**/*.less'], series('less'));
    done();
});

task('clean', () => {
    return src('./frontend/pub-assets/css', {read: false, allowEmpty: true})
        .pipe(clean());
});

task('webserver', (done) => {
    src(PUB.root)
    .pipe(webserver({
        host: ip.address(),
        port: process.env.PORT || 3000,
        directoryListing: true,
        open: '/index.html',
        fallback: '/index.html'
    }));
    done();
});

task('build',
    parallel('less', 'watch')
);
task('default',
    series('clean', 'build', 'webserver')
);
