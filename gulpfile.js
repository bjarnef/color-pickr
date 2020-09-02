const gulp = require("gulp");
const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const rename = require("gulp-rename");

const dist = "./dist";

gulp.task('copy', () => {

    var files = [
        './node_modules/@simonwep/pickr/dist/themes/**/*.min.css',
        './node_modules/@simonwep/pickr/dist/pickr.es5.min.js'
    ];

    return gulp.src(files)
        .pipe(rename(function (path) {
            console.log("path", path);
            
            path.basename = path.basename.replace(/.es5/, '');
            path.dirname += "/pickr" + (path.extname === '.css' ? "/themes" : "");
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('scripts', () => {

    var task = gulp.src('src/**/*.js');

    // check for js errors
    //task = task.pipe(eslint());

    // outputs the lint results to the console
    //task = task.pipe(eslint.format());

    task = task.pipe(babel())
    
    task = task.pipe(gulp.dest('./dev'));

    return task;
});

 // define complex tasks
//const js = gulp.series(scripts);

// export tasks
//exports.js = js;