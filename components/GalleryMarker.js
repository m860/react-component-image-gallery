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

var _reactMotion = require("react-motion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GalleryMarker = function (_PureComponent) {
	_inherits(GalleryMarker, _PureComponent);

	function GalleryMarker(props) {
		_classCallCheck(this, GalleryMarker);

		var _this = _possibleConstructorReturn(this, (GalleryMarker.__proto__ || Object.getPrototypeOf(GalleryMarker)).call(this, props));

		_this.state = {
			opacity: 0
		};
		return _this;
	}

	_createClass(GalleryMarker, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var src = this.props.source.constructor.name === "Object" ? this.props.source.uri : this.props.source;
			var style = Object.assign({}, this.props.style, {
				position: "absolute"
			});
			return _react2.default.createElement(
				_reactMotion.Motion,
				{
					onRest: function onRest() {
						var state = Object.assign({}, _this2.state, {
							opacity: 1
						});
						_this2.setState(state);
					},
					style: { x: (0, _reactMotion.spring)(this.props.x), y: (0, _reactMotion.spring)(this.props.y) },
					defaultStyle: { x: this.props.defaultX, y: this.props.defaultY } },
				function (_ref) {
					var x = _ref.x,
					    y = _ref.y;

					return _react2.default.createElement("img", {
						style: _extends({}, style, { top: y + "px", left: x + "px", opacity: _this2.state.opacity }),
						onClick: _this2.props.onClick,
						src: src });
				}
			);
		}
	}]);

	return GalleryMarker;
}(_react.PureComponent);

GalleryMarker.propTypes = {
	source: _propTypes2.default.any.isRequired,
	style: _propTypes2.default.object,
	onClick: _propTypes2.default.func,
	defaultX: _propTypes2.default.number,
	defaultY: _propTypes2.default.number,
	x: _propTypes2.default.number,
	y: _propTypes2.default.number
};
GalleryMarker.defaultProps = {
	onClick: function onClick() {
		return null;
	},
	style: {}
};
exports.default = GalleryMarker;