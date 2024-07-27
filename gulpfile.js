// passing values ​​to global variable
const IS_BUILD = process.argv.includes("--production");

// global plugins
import gulp from "gulp";
import gulpNotify from "gulp-notify";
import gulpPlumber from "gulp-plumber";
import gulpChanged from "gulp-changed";
import gulpIf from "gulp-if";

// plugin for delete destFolder
import del from "del";

// plugin for server
import browserSync from "browser-sync";

// plugins for html
import gulpFileInclude from "gulp-file-include";
import gulpTypograf from "gulp-typograf";
import gulpWebpHtml from "gulp-webp-html-nosvg";

// plugins for css
import gulpGroupCssMediaQueries from "gulp-group-css-media-queries";
import gulpCsso from "gulp-csso";
import gulpRename from "gulp-rename";
import gulpAutoprefixer from "gulp-autoprefixer";
// import gulpWebpCss from "gulp-webp-css";
import gulpSass from "gulp-sass";
import * as sass from 'sass';
const dartSass = gulpSass(sass);

// plugins for js
import webpackConfig from "./webpack.config.js";
import webpackStream from "webpack-stream";
import gulpBabel from "gulp-babel";

// plugins for img
import imagemin from "gulp-imagemin";
import gulpWebp from "gulp-webp";

// plugins for svg
import gulpSvgSprite from "gulp-svg-sprite";

// path
const srcFolder = './src/';
const destFolder = './docs/';

// config for plugins plumber and notify
const plumberNotify = (addTitle) => {
	return {
		errorHandler: gulpNotify.onError(error => ({
			title: addTitle,
			message: error.message
		}))
	}
};

// html task
const html = () => {
	return gulp.src(`${srcFolder}html/*.html`)
		.pipe(gulpPlumber(plumberNotify('html')))
		.pipe(gulpFileInclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(gulpIf(IS_BUILD, gulpWebpHtml()))
		.pipe(gulpTypograf({
			locale: ['ru', 'en-US']
		}))
		.pipe(gulp.dest(destFolder))
};
export { html };

// css task
const css = () => {
	return gulp.src(`${srcFolder}scss/*.scss`, { sourcemaps: IS_BUILD ? false : true })
		.pipe(gulpPlumber(plumberNotify('css')))
		.pipe(dartSass())
		// .pipe(gulpWebpCss())
		.pipe(gulpGroupCssMediaQueries())

		.pipe(gulpIf(IS_BUILD, gulpAutoprefixer({
			cascade: false,
			overrideBrowserslist: ["last 5 versions"]
		})))
		.pipe(gulpIf(IS_BUILD, gulpCsso()))
		.pipe(gulpRename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(gulp.dest(`${destFolder}css/`, { sourcemaps: IS_BUILD ? false : true }))
};
export { css };

// js task
const js = () => {
	return gulp.src(`${srcFolder}js/*.js`)
		.pipe(gulpPlumber(plumberNotify('js')))
		.pipe(gulpBabel())
		.pipe(webpackStream({
			mode: IS_BUILD ? "production" : "development",
			entry: webpackConfig,
			output: {
				filename: '[name].min.js',
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					},
				],
			},
		}))

		.pipe(gulp.dest(`${destFolder}js/`))
};
export { js };

// img task
const img = () => {
	return gulp.src(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json,svg}`)
		.pipe(gulpChanged(`${destFolder}img/`))
		.pipe(gulpPlumber(plumberNotify('img')))
		.pipe(gulpIf(IS_BUILD, gulpWebp()))
		.pipe(gulpIf(IS_BUILD, gulp.dest(`${destFolder}img/`)))
		.pipe(gulpIf(IS_BUILD, gulp.src(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json,svg}`)))
		.pipe(gulpIf(IS_BUILD, gulpChanged(`${destFolder}img/`)))
		.pipe(gulpIf(IS_BUILD, imagemin({ verbose: true })))
		.pipe(gulp.dest(`${destFolder}img/`))
};
export { img };

// svg task
const svg = () => {
	return gulp.src(`${srcFolder}svg/**/*.svg`)
		.pipe(gulpChanged(`${destFolder}img/svg/`))
		.pipe(gulpPlumber(plumberNotify('svg')))
		.pipe(gulpSvgSprite({
			mode: {
				stack: {
					sprite: `../sprite.svg`,
				},
			}
		}))
		.pipe(gulp.dest(`${destFolder}img/svg`))
};
export { svg };

// fonts task
const fonts = () => {
	return gulp.src(`${srcFolder}fonts/**/*.{woff,woff2}`)
		.pipe(gulpChanged(`${destFolder}fonts/`))
		.pipe(gulp.dest(`${destFolder}fonts/`))
};
export { fonts };

// files task
const files = () => {
	return gulp.src(`${srcFolder}files/**/*.*`)
		.pipe(gulpChanged(`${destFolder}files/`))
		.pipe(gulp.dest(`${destFolder}files/`))
};
export { files };

// delete docs dir
const clean = () => {
	return del(destFolder);
};
export { clean };

// browser-sync server
const server = () => {
	browserSync.init({
		server: {
			baseDir: destFolder
		}
	});
};
export { server };

// task to view changes to all tasks
const watcher = () => {
	gulp.watch(`${srcFolder}files/**/*.*`).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}html/**/*.html`, html).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}scss/**/*.scss`, css).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}js/**/*.js`, js).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json}`, img).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}svg/**/*.svg`, svg).on("all", browserSync.reload);
	gulp.watch(`${srcFolder}fonts/**/*.*`, fonts).on("all", browserSync.reload);
};
export { watcher };

const mainTasks = gulp.parallel(html, css, js, img, svg, fonts, files);

// npm run dev
const dev = gulp.series(clean, mainTasks, gulp.parallel(server, watcher));
export { dev };

// npm run build
const build = gulp.series(clean, mainTasks);
export { build };

// npm run preview
const previewBuild = gulp.series(clean, mainTasks, gulp.parallel(server));
export { previewBuild };