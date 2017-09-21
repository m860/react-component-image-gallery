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
			useSpring: false,
			scale: 1,
			x: 0,
			y: 0,
			width: null,
			height: null,
			imageIsReady: false,
			initialScale: 1,
			originalSize: {
				width: 0,
				height: 0
			},
			canRenderMarkers: false
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

			if (root) {
				return root.clientWidth;
			}
			return 0;
		}
	}, {
		key: "_getContainerHeight",
		value: function _getContainerHeight() {
			var root = this.refs.root;

			if (root) {
				return root.clientHeight;
			}
			return 0;
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
			var scale = diff / this.props.scaleRate;
			var targetScale = this.state.scale + scale;
			var state = Object.assign({}, this.state, {
				scale: targetScale > 0.1 ? targetScale : 0.1
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
			var state = Object.assign({}, this.state, { x: x, y: y, scale: scale, useSpring: true });
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

			if (!this.state.imageIsReady) {
				return null;
			}
			var markers = this.props.item.markers || [];
			return _react2.default.createElement(
				"div",
				{ className: this.props.className, style: _extends({}, this.props.style, { position: "relative" }), ref: "root" },
				_react2.default.createElement(
					_reactMotion.Motion,
					{
						defaultStyle: { scale: 1, x: 0, y: 0 },
						onRest: function onRest() {
							var state = Object.assign({}, _this2.state, {
								useSpring: false
							});
							_this2.setState(state);
						},
						style: {
							scale: this.state.useSpring ? (0, _reactMotion.spring)(this.state.scale) : this.state.scale,
							x: this.state.useSpring ? (0, _reactMotion.spring)(this.state.x / this.state.scale) : this.state.x / this.state.scale,
							y: this.state.useSpring ? (0, _reactMotion.spring)(this.state.y / this.state.scale) : this.state.y / this.state.scale
						} },
					function (_ref) {
						var scale = _ref.scale,
						    x = _ref.x,
						    y = _ref.y;

						return _react2.default.createElement("img", {
							style: { transform: "scale(" + scale + ") translate(" + x + "px," + y + "px)", transformOrigin: "center center" },
							onLoad: function onLoad(event) {
								var target = event.target;

								var state = Object.assign({}, _this2.state, {
									width: target.width,
									height: target.height,
									//counter:this.state.counter+1,
									initialScale: target.width / _this2.state.originalSize.width,
									canRenderMarkers: true
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
				this.state.canRenderMarkers && markers.map(function (marker, index) {
					var containerWidth = _this2._getContainerWidth();
					var containerHeight = _this2._getContainerHeight();
					var imageRealWidth = _this2._getRealWidth();
					var imageRealHeight = _this2._getRealHeight();

					var diff = {
						x: (containerWidth - imageRealWidth) / 2,
						y: (containerHeight - imageRealHeight) / 2
					};

					var x = marker.x * _this2.state.initialScale;
					//+偏移
					x *= _this2.state.scale;
					x += diff.x;
					x += _this2.state.x;
					var y = marker.y * _this2.state.initialScale;
					y *= _this2.state.scale;
					y += _this2.state.y;
					y += diff.y;
					return _react2.default.createElement(_GalleryMarker2.default, _extends({}, marker, { key: index, x: x, y: y, defaultX: marker.x,
						defaultY: marker.y }));
				})
			);
		}
	}, {
		key: "_loadImageComplete",
		value: function _loadImageComplete(err, event) {
			var imageOriginalSize = {
				width: event.target.width,
				height: event.target.height
			};

			var state = Object.assign({}, this.state, {
				imageIsReady: true,
				originalSize: imageOriginalSize
			});
			this.setState(state);
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this3 = this;

			this._mounted = true;
			var image = new Image();
			image.src = this.props.item.original;
			image.onload = function (event) {
				_this3._loadImageComplete(null, event);
			};
			image.onerror = function (err) {
				_this3._loadImageComplete(err);
			};
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
	maxScale: _propTypes2.default.number,
	style: _propTypes2.default.object,
	className: _propTypes2.default.string,
	scaleRate: _propTypes2.default.number
};
GalleryItem.defaultProps = {
	minScale: 1,
	maxScale: 3,
	style: {},
	className: '',
	scaleRate: 100
};
exports.default = GalleryItem;