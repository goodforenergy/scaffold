'use strict';
var argv = require('yargs').argv,
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	del = require('del'),
	gulp = require('gulp'),
	gulpIf = require('gulp-if'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	prefix = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver'),

	dest = './build';

gulp.task('clean', function(cb) {
	del(['./build'], cb);
});

gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulpIf(!argv.prod, uglify()))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(dest));
});

gulp.task('css', function() {
	return gulp.src('src/css/**/*.css')
	.pipe(prefix('last 2 versions', 'ie 8'))
		.pipe(gulpIf(argv.prod, minifyCSS()))
		.pipe(concat('styles.css'))
		.pipe(gulp.dest(dest));
});

gulp.task('pages', function() {
	return gulp.src('src/**/*.html')
		.pipe(changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('images', function() {
	var imageDest = dest + '/images';
	return gulp.src('./src/images/**')
		.pipe(imagemin())
		.pipe(gulp.dest(imageDest));
});

gulp.task('build', ['js', 'css', 'pages', 'images']);

gulp.task('watch', ['build'], function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch(['src/**/*.html'], ['pages']);
	gulp.watch('src/css/**/*.css', ['css']);
	gulp.watch('src/images/**/*', ['images']);
});

gulp.task('serve', function() {
	gulp.src('./build')
		.pipe(webserver({
			host: argv.host || 'localhost',
			port: argv.port || '9000',
			livereload: true
		}));
});

gulp.task('default', ['build']);
