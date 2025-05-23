/* sourceType: module */
const { src, dest, series, parallel, watch } = require('gulp');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const nunjucks = require('gulp-nunjucks')
const nunjucksRender = require('gulp-nunjucks-render');
const fs = require('fs')
const htmlmin = require('gulp-htmlmin')
livereload = require('gulp-livereload')
const gitVersion = require('@corteks/gitversion').default

function ver(){
    return gitVersion()
        .then((informations) => {
            return informations.CURRENT_COMMIT_SHORT_ID
        })
        .catch((err) => {
            throw new Error('gitver!!!')
        })
}

const inlinesource = require('gulp-inline-source');

function static() {
    return src('static/**/*')
        .pipe(dest('../static'))
        .pipe(livereload())
}

async function htmlHU() {
    // const data = JSON.parse(fs.readFileSync(__dirname + '/html/data.json'))
    return src(['html/**/*.html', '!html/tpl/**'])
        .pipe(nunjucksRender({
            path: '.',
            data: {
                version: await ver(),
                lang: "HU",
                houses: houses,
            }
        }))
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(inlinesource())
        .pipe(dest('../'))
        .pipe(livereload())
}

async function htmlEN() {
    // const data = JSON.parse(fs.readFileSync(__dirname + '/html/data.json'))
    return src(['html/**/*.html', '!html/tpl/**'])
        .pipe(nunjucksRender({
            path: '.',
            data: {
                version: await ver(),
                lang: "EN",
                houses: houses,
            }
        }))
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(inlinesource())
        .pipe(dest('../en'))
        .pipe(livereload())
}

function css() {
    const postcss = require('gulp-postcss')

    const postcssPlugins = [
        require('postcss-import'),
        require('postcss-css-variables'),
        require('autoprefixer'),
    ]

    return src('css/!(_)*.css')
        .pipe(postcss(postcssPlugins))
        .pipe(csso())
        .pipe(dest('../css'))
        .pipe(livereload())
}

function js() {
    return src('js/*.js')
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(livereload())
}


function _watch() {
    livereload.listen({ basePath: 'dist' })
    watch(['html/**/*.html', 'html/data.json', 'js/inline/*.js'], htmlHU)
    watch(['html/**/*.html', 'html/data.json', 'js/inline/*.js'], htmlEN)
    watch('css/**/*.css', css)
    watch(['js/**/*.js', '!js/inline/*.js'], js)
    watch('static/**/*.*', static)
    // watch('manifest.json', manifest)
    // watch('sw.js', sw)
}

exports.htmlHU = htmlHU;
exports.htmlEN = htmlEN;
exports.css = css;
exports.js = js;
exports.static = static;
exports.build = series(parallel(css, js, static, htmlHU, htmlEN));
exports.watch = _watch;



const houses = {
    miro: {
        sarga: {
            gallery: ['01', '02', '15', '16', '17', '18', '19', '20', '08', '09', '10', '11', '12', '13', '14']
        },
        barna: {
            gallery: ['20', '21', '22', '23', '24', '02', '08', '09', '10', '11', '15', '17', '18', '19']
        },
        szurke: {
            gallery: ['01', '02', '03', '04', '05', '06', '07']
        },
        kek: {
            gallery: ['01', '02', '21', '22', '23', '24', '03', '04', '05', '06', '07', '09', '10', '14']
        },
    },
    dali: {
        bezs: {
            gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27']
        },
        lila: {
            gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '14', '16', '19', '20', '22', '23', '25', '26', '27', '28', '29']
        },
        piros: {
            gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        },
        zold: {
            gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']
        },
    }
}

