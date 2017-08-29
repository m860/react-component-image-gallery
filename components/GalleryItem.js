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

var _GalleryMarker = require("./GalleryMarker");

var _GalleryMarker2 = _interopRequireDefault(_GalleryMarker);

var _reactMotion = require("react-motion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var actionType = {
	none: 0,
	scaling: 1,
	moving: 2
};

var GalleryItem = function (_PureComponent) {
	_inherits(GalleryItem, _PureComponent);

	function GalleryItem(props) {
		_classCallCheck(this, GalleryItem);

		var _this = _possibleConstructorReturn(this, (GalleryItem.__proto__ || Object.getPrototypeOf(GalleryItem)).call(this, props));

		_this._actionType = actionType.none;
		_this._touchStart = false;
		_this._lastTouches = [];
		_this._mounted = false;
		_this.state = {
			scale: 1,
			x: 0,
			y: 0,
			width: null,
			height: null,
			counter: 0 // ==1 is ready
		};
		return _this;
	}

	_createClass(GalleryItem, [{
		key: "_getRealWidth",
		value: function _getRealWidth() {
			return this.state.width * this.state.scale;
		}
	}, {
		key: "_getRealHeight",
		value: function _getRealHeight() {
			return this.state.height * this.state.scale;
		}
	}, {
		key: "_getContainerWidth",
		value: function _getContainerWidth() {
			var root = this.refs.root;

			return root.clientWidth;
		}
	}, {
		key: "_getContainerHeight",
		value: function _getContainerHeight() {
			var root = this.refs.root;

			return root.clientHeight;
		}
	}, {
		key: "_getMovingRegion",
		value: function _getMovingRegion(scale) {
			var width = this.state.width * scale;
			var height = this.state.height * scale;
			var hw = width / 2;
			var hh = height / 2;
			var containerWidth = this._getContainerWidth();
			var containerHeight = this._getContainerHeight();
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
		value: function _moving(event) {
			//event.preventDefault();
			//event.stopPropagation();
			var touch = event.targetTouches[0];
			var lastTouch = this._lastTouches[0];
			var diff = {
				x: touch.pageX - lastTouch.pageX,
				y: touch.pageY - lastTouch.pageY
			};
			this._lastTouches = [touch];

			var newState = Object.assign({}, this.state, {
				x: this.state.x + diff.x,
				y: this.state.y + diff.y
			});
			var region = this._getMovingRegion(this.state.scale);
			if (newState.x <= region.right && newState.x >= region.left) {
				event.stopPropagation();
				this.setState(newState);
			}
		}
	}, {
		key: "_getDistance",
		value: function _getDistance(touches) {
			var touch1 = touches[0];
			var touch2 = touches[1];
			return Math.sqrt(Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2));
		}
	}, {
		key: "_scale",
		value: function _scale(event) {
			var dis1 = this._getDistance(event.targetTouches);
			var dis2 = this._getDistance(this._lastTouches);
			this._lastTouches = event.targetTouches;

			var diff = dis1 - dis2;
			var scale = diff / 1000;

			var state = Object.assign({}, this.state, {
				scale: this.state.scale + scale
			});
			this.setState(state);
		}
	}, {
		key: "_restore",
		value: function _restore(event) {
			var x = this.state.x;
			var y = this.state.y;
			var scale = this.state.scale;
			var region = this._getMovingRegion(this.state.scale);
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
			var state = Object.assign({}, this.state, { x: x, y: y, scale: scale });
			this.setState(state);
		}
	}, {
		key: "reset",
		value: function reset() {
			if (this._mounted) {
				this.setState(Object.assign({}, this.state, {
					x: 0,
					y: 0,
					scale: 1
				}));
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var markers = this.props.item.markers || [];
			return _react2.default.createElement(
				"div",
				{ style: { position: "relative" }, ref: "root" },
				_react2.default.createElement(
					_reactMotion.Motion,
					{
						defaultStyle: { scale: 1, x: 0, y: 0 },
						style: { scale: (0, _reactMotion.spring)(this.state.scale), x: (0, _reactMotion.spring)(this.state.x / this.state.scale), y: (0, _reactMotion.spring)(this.state.y / this.state.scale) } },
					function (_ref) {
						var scale = _ref.scale,
						    x = _ref.x,
						    y = _ref.y;

						return _react2.default.createElement("img", {
							style: { transform: "scale(" + scale + ") translate(" + x + "px," + y + "px)", transformOrigin: "center center" },
							onLoad: function onLoad(_ref2) {
								var target = _ref2.target;

								var state = Object.assign({}, _this2.state, {
									width: target.width,
									height: target.height,
									counter: _this2.state.counter + 1
								});
								_this2.setState(state);
							},
							onTouchStart: function onTouchStart(event) {
								_this2._touchStart = true;
								event.persist();
								_this2._lastTouches = event.targetTouches;
								if (_this2._lastTouches.length >= 2) {
									_this2._actionType = actionType.scaling;
								} else {
									_this2._actionType = actionType.moving;
								}
							},
							onTouchMove: function onTouchMove(event) {
								event.preventDefault();
								if (_this2._touchStart) {
									event.persist();
									if (_this2._actionType === actionType.scaling) {
										_this2._scale(event);
									} else {
										_this2._moving(event);
									}
								}
							},
							onTouchEnd: function onTouchEnd(event) {
								_this2._touchStart = false;
								_this2._lastTouches = [];
								_this2._actionType = actionType.none;
								_this2._restore(event);
							},
							src: _this2.props.item.original });
					}
				),
				this.state.counter >= 1 && markers.map(function (marker, index) {
					var containerWidth = _this2._getContainerWidth();
					var containerHeight = _this2._getContainerHeight();
					var newX = containerWidth / 2 + marker.x * _this2.state.scale + _this2.state.x;
					var newY = containerHeight / 2 + marker.y * _this2.state.scale + _this2.state.y;
					return _react2.default.createElement(_GalleryMarker2.default, _extends({}, marker, { key: index, x: newX, y: newY, defaultX: marker.x,
						defaultY: marker.y }));
				})
			);
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			this._mounted = true;
			var state = Object.assign({}, this.state, {
				counter: this.state.counter + 1
			});
			this.setState(state);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this._mounted = false;
		}
	}]);

	return GalleryItem;
}(_react.PureComponent);

GalleryItem.propTypes = {
	item: _propTypes2.default.object.isRequired,
	minScale: _propTypes2.default.number,
	maxScale: _propTypes2.default.number
};
GalleryItem.defaultProps = {
	minScale: 0.5,
	maxScale: 3
};
exports.default = GalleryItem;