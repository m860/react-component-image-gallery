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

var defaultStyle = {
	x: 0,
	y: 0,
	scale: 1
};

var ViewTransform = function (_PureComponent) {
	_inherits(ViewTransform, _PureComponent);

	function ViewTransform(props) {
		_classCallCheck(this, ViewTransform);

		var _this = _possibleConstructorReturn(this, (ViewTransform.__proto__ || Object.getPrototypeOf(ViewTransform)).call(this, props));

		_this.state = {
			x: 0,
			y: 0,
			scale: 1,
			useSpring: false
		};
		_this._point1 = null;
		_this._originalSize = null;
		return _this;
	}

	// get _originalSize():Size{
	// 	const {root}=this.refs;
	// 	if (root) {
	// 		return new Size(root.clientWidth, root.clientHeight);
	// 	}
	// 	return new Size();
	// }

	_createClass(ViewTransform, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var style = {
				x: this.state.useSpring ? (0, _reactMotion.spring)(this.state.x) : this.state.x,
				y: this.state.useSpring ? (0, _reactMotion.spring)(this.state.y) : this.state.y,
				scale: this.state.useSpring ? (0, _reactMotion.spring)(this.state.scale) : this.state.scale
			};
			return _react2.default.createElement(
				_reactMotion.Motion,
				{
					onRest: function onRest() {
						var state = Object.assign({}, _this2.state, {
							useSpring: false
						});
						_this2.setState(state);
					},
					defaultStyle: defaultStyle,
					style: style },
				function (_ref) {
					var x = _ref.x,
					    y = _ref.y,
					    scale = _ref.scale;

					return _react2.default.createElement(
						"div",
						{
							onMouseDown: _this2._onMouseDown.bind(_this2),
							onMouseMove: _this2._onMouseMove.bind(_this2),
							onMouseUp: _this2._onMouseUp.bind(_this2),
							onTouchStart: _this2._onTouchStart.bind(_this2),
							onTouchMove: _this2._onTouchMove.bind(_this2),
							onTouchEnd: _this2._onTouchEnd.bind(_this2),
							className: _this2.props.className,
							style: _extends({}, _this2.props.style, { transform: "translate(" + x + "px," + y + "px) scale(" + scale + ")" }),
							ref: "root" },
						_this2.props.children,
						_react2.default.createElement(
							"div",
							{ style: { position: "absolute", top: 0, left: 0, right: 0 } },
							_react2.default.createElement(
								"button",
								{ type: "button", onClick: function onClick() {
										var state = Object.assign({}, _this2.state, {
											scale: _this2.state.scale - 0.1
										});
										_this2.setState(state);
									} },
								"zoom in"
							),
							_react2.default.createElement(
								"button",
								{ type: "button", onClick: function onClick() {
										var state = Object.assign({}, _this2.state, {
											scale: _this2.state.scale + 0.1
										});
										_this2.setState(state);
									} },
								"zoom out"
							)
						)
					);
				}
			);
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			// const {root}=this.refs;
			// if (root) {
			// 	this._originalSize = new Size(root.clientWidth, root.clientHeight);
			// }
		}
	}, {
		key: "_getMovingRegion",
		value: function _getMovingRegion(scale) {
			var realSize = this._realSize;
			var width = realSize.width;
			var height = realSize.height;
			var hw = width / 2;
			var hh = height / 2;
			var containerWidth = this._originalSize.width;
			var containerHeight = this._originalSize.height;
			var halfContainerWidth = containerWidth / 2;
			var halfContainerHeight = containerHeight / 2;

			var left = {
				x: hw * -1,
				y: hh * -1
			};
			var diffWidth = Math.abs(left.x + halfContainerWidth);
			var offsetX = diffWidth;
			var diffHeight = Math.abs(left.y + halfContainerHeight);
			var offsetY = diffHeight;
			return {
				left: -offsetX,
				right: offsetX,
				top: -offsetY,
				bottom: offsetY
			};
		}
	}, {
		key: "_moving",
		value: function _moving(point) {
			var diff = this._point1.diff(point);
			this._point1 = point;
			var state = Object.assign({}, this.state, {
				x: this.state.x + diff.x,
				y: this.state.y + diff.y
			});
			// console.log(`mouse move diff : ${JSON.stringify(diff)}`)
			this.setState(state);
		}
	}, {
		key: "_restore",
		value: function _restore() {
			var region = this._getMovingRegion(this.state.scale);

			var x = this.state.x;
			var y = this.state.y;
			var scale = this.state.scale;
			if (x > region.right) {
				x = region.right;
			} else if (x < region.left) {
				x = region.left;
			}
			if (y < region.top) {
				y = region.top;
			} else if (y > region.bottom) {
				y = region.bottom;
			}
			if (scale < this.props.minScale) {
				scale = this.props.minScale;
			} else if (scale > this.props.maxScale) {
				scale = this.props.maxScale;
			}
			var state = Object.assign({}, this.state, { x: x, y: y, scale: scale, useSpring: true });
			this.setState(state);
		}
	}, {
		key: "_onTouchStart",
		value: function _onTouchStart(event) {
			event.persist();
			if (!this._originalSize) {
				this._originalSize = new Size(event.target.clientWidth, event.target.clientHeight);
			}
			var touch1 = event.targetTouches[0];
			this._point1 = new Point(touch1.pageX, touch1.pageY);
		}
	}, {
		key: "_onTouchMove",
		value: function _onTouchMove(event) {
			event.persist();
			var touch1 = event.targetTouches[0];
			if (this._point1) {
				var point = new Point(touch1.pageX, touch1.pageY);
				this._moving(point);
			}
		}
	}, {
		key: "_onTouchEnd",
		value: function _onTouchEnd(event) {
			this._point1 = null;
			this._restore();
		}
	}, {
		key: "_onMouseDown",
		value: function _onMouseDown(event) {
			event.persist();
			if (!this._originalSize) {
				this._originalSize = new Size(event.target.clientWidth, event.target.clientHeight);
			}
			this._point1 = new Point(event.pageX, event.pageY);
		}
	}, {
		key: "_onMouseMove",
		value: function _onMouseMove(event) {
			event.persist();
			if (this._point1) {
				var point = new Point(event.pageX, event.pageY);
				this._moving(point);
			}
		}
	}, {
		key: "_onMouseUp",
		value: function _onMouseUp(event) {
			this._point1 = null;
			this._restore();
		}
	}, {
		key: "_addEventListener",
		value: function _addEventListener(ele, events, callback) {
			events.split(' ').forEach(function (name) {
				ele.addEventListener(name, callback, false);
			});
		}
	}, {
		key: "_removeEventListener",
		value: function _removeEventListener(ele, events, callback) {
			events.split(' ').forEach(function (name) {
				ele.removeEventListener(name, callback, false);
			});
		}
	}, {
		key: "_realSize",
		get: function get() {
			if (this._originalSize) {
				return new Size(this._originalSize.width * this.state.scale, this._originalSize.height * this.state.scale);
			}
			return new Size();
		}
	}]);

	return ViewTransform;
}(_react.PureComponent);

ViewTransform.propTypes = {
	style: _propTypes2.default.object,
	className: _propTypes2.default.string
};
ViewTransform.defaultProps = {
	style: {},
	className: ''
};
exports.default = ViewTransform;

var Point = function () {
	function Point() {
		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

		_classCallCheck(this, Point);

		this.x = x;
		this.y = y;
	}

	_createClass(Point, [{
		key: "diff",
		value: function diff(point) {
			return new Point(point.x - this.x, point.y - this.y);
		}
	}]);

	return Point;
}();

var Size = function Size() {
	var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	_classCallCheck(this, Size);

	this.width = width;
	this.height = height;
};