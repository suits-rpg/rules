var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');
var convert = require('gulp-convert');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

gulp.task('static', function () {
    return gulp.src(['**/*.js', '!webpackSim', '!webpackSim/**/*.js'])
        .pipe(excludeGitignore())
        .pipe(eslint({
            rules: {
                indent: 0,
                'no-trailing-spaces': 0,
                'no-multiple-empty-lines': 0,
                'quote-props': 0,
                'no-unneeded-ternary': 0,
                'padded-blocks': 0,
                'max-nested-callbacks': 0,
                'quotes': 0
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
    nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
    return gulp.src('lib/**/*.js')
        .pipe(excludeGitignore())
        .pipe(istanbul({
            includeUntested: true,
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test', 'unit-test']);

gulp.task('unit-test', function (cb) {
    var mochaErr;

    gulp.src('test/**/*.js')
        .pipe(plumber())
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

gulp.task('watch', function () {
    gulp.watch(['lib/**/*.js', 'test/**'], ['test']);
});

gulp.task('csv2json', function () {
    gulp.src('lib/data/weaponsAndArmor/*.csv')
        .pipe(convert({
            from: 'csv',
            to: 'json'
        }))
        .pipe(gulp.dest('lib/items/'));
});

gulp.task('babel', function () {
    return gulp.src('lib/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('json', function () {
    return gulp.src('lib/**/*.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    return del.sync('dist');
    cb();
});

gulp.task('prepublish', ['nsp', 'clean', 'babel', 'json']);
gulp.task('default', ['static', 'test']);
