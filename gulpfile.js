var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	coverage = require('gulp-coverage');

var paths = {
	'src':['./index.js', './lib/**/*.js'],
	'tests':['./test/**/*.js']
};

// lint task
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

});

// gulp for running the mocha tests with default dot reporter
gulp.task('test', function(){
	gulp.src(paths.tests)
		.pipe(mocha({reporter: 'dot'}));
});

// gulp for running the mocha tests with spec reporter
gulp.task('spec', function(){
	gulp.src(paths.tests)
		.pipe(coverage.instrument({
			pattern: paths.src,
			debugDirectory: '.coverage'
		}))
		.pipe(mocha({reporter: 'spec'}))
		.pipe(coverage.report({outFile: 'coverage.html'}));
});

gulp.task('default', ['lint', 'spec']);
