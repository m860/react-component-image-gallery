"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactImageGallery = require("react-image-gallery");

var _reactImageGallery2 = _interopRequireDefault(_reactImageGallery);

var _GalleryItem = require("./GalleryItem");

var _GalleryItem2 = _interopRequireDefault(_GalleryItem);

require("react-image-gallery/styles/css/image-gallery.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Gallery - 画廊,支持缩放,支持marker
 *
 * 组件缩放/移动/marker的特性是通过renderItem来实现的,因此请不要对renderItem方法进行重写.
 *
 * @example
 *
 *  class GalleryDemo extends Component {
 * 	render() {
 * 		return (
 * 			<Gallery
 * 				showPlayButton={false}
 * 				showNav={false}
 * 				showThumbnails={false}
 * 				showFullscreenButton={false}
 * 				useBrowserFullscreen={false}
 * 				items={[
 * 					{
 * 						original:require('./asset/2.jpg'),
 * 						markers:[
 * 							{
 * 								source:require('./asset/floor.png'),
 * 								style:{width:"20px",height:"20px"},
 * 								x:10,
 * 								y:10,
 * 								onClick:()=>{
 * 									alert('click')
 * 								}
 * 							}
 * 						]
 * 					},
 * 					{original:require('./asset/3.jpg')},
 * 					{original:require('./asset/4.jpg')}
 * 				]}/>
 * 		);
 * 	}
 * }
 * */
var Gallery = function (_PureComponent) {
	_inherits(Gallery, _PureComponent);

	/**
  * {@link https://github.com/xiaolin/react-image-gallery#props ...react-image-gallery.props }
  * @property {?Object} style
  * @property {?String} className
  * @property {?Number} minScale [1] - 最小缩放
  * @property {?Number} maxScale [3] - 最大缩放
  * */
	function Gallery(props) {
		_classCallCheck(this, Gallery);

		var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props));

		_this._prevItem = null;
		return _this;
	}

	_createClass(Gallery, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(_reactImageGallery2.default, _extends({}, this.props, {
				renderItem: function renderItem(item) {
					return _react2.default.createElement(_GalleryItem2.default, _extends({}, _this2.props.itemOptions, {
						ref: function ref(component) {
							if (_this2._prevItem) {
								_this2._prevItem.reset();
							}
							_this2._prevItem = component;
						},
						item: item,
						maxScale: _this2.props.maxScale,
						minScale: _this2.props.minScale }));
				}
			}));
		}
	}]);

	return Gallery;
}(_react.PureComponent);

Gallery.propTypes = {
	style: _propTypes2.default.object,
	className: _propTypes2.default.string,
	minScale: _propTypes2.default.number,
	maxScale: _propTypes2.default.number,
	itemOptions: _propTypes2.default.shape({
		style: _propTypes2.default.object,
		className: _propTypes2.default.string
	})
};
Gallery.defaultProps = {
	itemOptions: {}
};
exports.default = Gallery;