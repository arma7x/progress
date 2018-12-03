const fs = require('fs')
const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const SWPrecache = require('sw-precache-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const HTML = require('html-webpack-plugin');
const uglify = require('./uglify');
const UglifyJS = require('uglify-es');

const root = join(__dirname, '..');

module.exports = isProd => {
	// base plugins array
	const plugins = [
		new Copy([{ context: 'src/static/', from: '**/*.*' }]),
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
		})
	];

	if (isProd) {
		plugins.push(
			new Clean(['dist'], { root }),
			new HTML({ 
				template: 'src/index.html',
				serviceWorkerLoader: `<script>${UglifyJS.minify(fs.readFileSync(join(__dirname, './service-worker-prod.js'), 'utf-8')).code}</script>`
			}),
			new webpack.LoaderOptionsPlugin({ minimize:true }),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new webpack.optimize.UglifyJsPlugin(uglify),
			new ExtractText('styles.[hash].css'),
			new SWPrecache({
				cacheId: 'track-my-app',
				staticFileGlobs: ['dist/*.{js,html,css,eot,svg,ttf,woff,woff2}','dist/icon/*.{png}'],
				minify: true,
				filename: 'sw.js',
				stripPrefix: 'dist/'
			})
		);
	} else {
		// dev only
		plugins.push(
			new HTML({ 
				template: 'src/index.html',
				serviceWorkerLoader: `<script>${fs.readFileSync(join(__dirname, './service-worker-dev.js'), 'utf-8')}</script>`
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin()
		);
	}

	return plugins;
};
