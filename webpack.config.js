var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

var isProduction = function () {
	return process.env.NODE_ENV === 'production';
};

console.log("environment:%s", process.env.NODE_ENV);

var output = {
	path: path.join(__dirname, "dist")
};
if (isProduction()) {
	output.filename = "[hash].js";
	output.chunkFilename = "[chunkhash].[hash].js";
	// output.chunkFilename = "[id].[hash].js";
}
else {
	output.filename = "bundle.js";
	output.chunkFilename = "[chunkhash].bundle.js";
}

var plugins = [
	//package vendor libs
	// new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	new webpack.optimize.CommonsChunkPlugin({
		name:"vendor"
		,filename:"vendor.bundle.js"
	})
	//global module
	// , new webpack.ProvidePlugin({
	// 	React: 'react'
	// 	, ReactDOM: "react-dom"
	// 	, classNames: "classnames"
	// 	, ReactCSSTransitionGroup: "react-addons-css-transition-group"
	// })
	//clean dist
	, new CleanWebpackPlugin(['dist'], {
		root: __dirname,
		verbose: true,
		dry: false
	})
	//inject style & javascript to index.html template
	, new HtmlWebpackPlugin({
		filename: "index.html",
		template: './src/index.html',
		inject: false
	})

];
if (isProduction()) {
	//package style
	plugins.push(new ExtractTextPlugin("[contenthash].css"));
	//compress javascript
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}));
	plugins.push(new webpack.optimize.DedupePlugin());
}
else {
	plugins.push(new ExtractTextPlugin("style.css"));
}

module.exports = {
	entry: {
		index: "./src/app.js",
		vendor: [
			"babel-polyfill"
			, "react"
			, "react-dom"
			// , "classnames"
		]
	}
	, output: output
	, module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader")
			},
			{
				test: /\.(jsx|js)?$/
				,exclude: /(node_modules|bower_components)/
				// 'babel-loader' is also a legal name to reference
				//loaders: ["babel-loader?presets[]=es2016,presets[]=react", "eslint-loader?{rules:{semi:0}}"]
				, loader: "babel-loader"
			}, {
				test: /\.sass$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")
			}, {
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			}, {
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&mimetype=application/font-woff"
			},{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},{
				test: /\.(ogg|mp3)$/,
				loader: "file-loader"
			}
		]
		, preLoaders: [
			{
				test: /\.jsx$/
				, loader: "eslint-loader"
				, exclude: /node_modules/
			}
		]
	}
	, babel: {
		presets: ["es2015", 'stage-0', "react"]
		, plugins: [
			"transform-runtime"
		]
	}
	, postcss: function () {
		return [autoprefixer({browsers: ['> 5%']})];
	}
	, resolve: {
		//设置别名
		alias: {
		}
	}
	, plugins: plugins
};