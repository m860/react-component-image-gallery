import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Motion, spring} from 'react-motion'

const defaultStyle = {
	x: 0,
	y: 0,
	scale: 1
};

export default class ViewTransform extends PureComponent {
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string
	};
	static defaultProps = {
		style: {},
		className: ''
	};

	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 0,
			scale: 1,
			useSpring: false
		};
		this._point1 = null;
		this._originalSize = null;
	}

	// get _originalSize():Size{
	// 	const {root}=this.refs;
	// 	if (root) {
	// 		return new Size(root.clientWidth, root.clientHeight);
	// 	}
	// 	return new Size();
	// }

	get _realSize(): Size {
		if (this._originalSize) {
			return new Size(this._originalSize.width * this.state.scale, this._originalSize.height * this.state.scale);
		}
		return new Size();
	}

	render() {
		const style = {
			x: this.state.useSpring ? spring(this.state.x) : this.state.x,
			y: this.state.useSpring ? spring(this.state.y) : this.state.y,
			scale: this.state.useSpring ? spring(this.state.scale) : this.state.scale
		};
		return (
			<Motion
				onRest={()=>{
					console.log(`${JSON.stringify(this.state)}`)
					const state=Object.assign({},this.state,{
						useSpring:false
					});
					this.setState(state);
				}}
				defaultStyle={defaultStyle}
				style={style}>
				{({x, y, scale})=> {
					return (
						<div
							onMouseDown={this._onMouseDown.bind(this)}
							onMouseMove={this._onMouseMove.bind(this)}
							onMouseUp={this._onMouseUp.bind(this)}
							onTouchStart={this._onTouchStart.bind(this)}
							onTouchMove={this._onTouchMove.bind(this)}
							onTouchEnd={this._onTouchEnd.bind(this)}
							className={this.props.className}
							style={{...this.props.style,transform:`translate(${x}px,${y}px) scale(${scale})`}}
							ref="root">
							{this.props.children}
							<div style={{position:"absolute",top:0,left:0,right:0}}>
								<button type="button" onClick={()=>{
									const state=Object.assign({},this.state,{
										scale:this.state.scale-0.1
									});
									this.setState(state);
								}}>zoom in
								</button>
								<button type="button" onClick={()=>{
									const state=Object.assign({},this.state,{
										scale:this.state.scale+0.1
									});
									this.setState(state);
								}}>zoom out
								</button>
							</div>
						</div>
					);
				}}
			</Motion>
		);
	}

	componentDidMount() {
		// const {root}=this.refs;
		// if (root) {
		// 	this._originalSize = new Size(root.clientWidth, root.clientHeight);
		// }
	}

	_getMovingRegion(scale) {
		const realSize = this._realSize;
		const width = realSize.width;
		const height = realSize.height;
		const hw = width / 2;
		const hh = height / 2;
		const containerWidth = this._originalSize.width;
		const containerHeight = this._originalSize.height;
		const halfContainerWidth = containerWidth / 2;
		const halfContainerHeight = containerHeight / 2;

		const left = {
			x: hw * -1,
			y: hh * -1
		};
		const diffWidth = Math.abs(left.x + halfContainerWidth);
		const offsetX = diffWidth;
		const diffHeight = Math.abs(left.y + halfContainerHeight);
		const offsetY = diffHeight;
		return {
			left: -offsetX,
			right: offsetX,
			top: -offsetY,
			bottom: offsetY,
		};
	}

	_moving(point) {
		const diff = this._point1.diff(point);
		this._point1 = point;
		const state = Object.assign({}, this.state, {
			x: this.state.x + diff.x,
			y: this.state.y + diff.y
		});
		// console.log(`mouse move diff : ${JSON.stringify(diff)}`)
		this.setState(state);
	}

	_restore(){
		const region = this._getMovingRegion(this.state.scale);
		console.log(`region : ${JSON.stringify(region)}`);
		let x = this.state.x;
		let y = this.state.y;
		let scale = this.state.scale;
		if (x > region.right) {
			x = region.right;
		}
		else if (x < region.left) {
			x = region.left;
		}
		if (y < region.top) {
			y = region.top;
		}
		else if (y > region.bottom) {
			y = region.bottom;
		}
		if (scale < this.props.minScale) {
			scale = this.props.minScale;
		}
		else if (scale > this.props.maxScale) {
			scale = this.props.maxScale;
		}
		const state = Object.assign({}, this.state, {x, y, scale, useSpring: true});
		this.setState(state);
	}

	_onTouchStart(event) {
		event.persist();
		if (!this._originalSize) {
			this._originalSize = new Size(event.target.clientWidth, event.target.clientHeight);
		}
		const touch1 = event.targetTouches[0];
		this._point1 = new Point(touch1.pageX, touch1.pageY);
	}

	_onTouchMove(event) {
		event.persist();
		const touch1 = event.targetTouches[0];
		if (this._point1) {
			const point = new Point(touch1.pageX, touch1.pageY);
			this._moving(point);
		}
	}

	_onTouchEnd(event) {
		this._point1 = null;
		this._restore();
	}

	_onMouseDown(event) {
		event.persist();
		if (!this._originalSize) {
			this._originalSize = new Size(event.target.clientWidth, event.target.clientHeight);
		}
		this._point1 = new Point(event.pageX, event.pageY);
		console.log(`mouse down : ${JSON.stringify(this._point1)}`)
	}

	_onMouseMove(event) {
		event.persist();
		if (this._point1) {
			const point = new Point(event.pageX, event.pageY);
			this._moving(point);
		}
	}

	_onMouseUp(event) {
		this._point1 = null;
		this._restore();
	}

	_addEventListener(ele, events, callback) {
		events.split(' ').forEach(name=> {
			ele.addEventListener(name, callback, false);
		});
	}

	_removeEventListener(ele, events, callback) {
		events.split(' ').forEach(name=> {
			ele.removeEventListener(name, callback, false);
		});
	}
}

class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	diff(point: Point): Point {
		return new Point(point.x - this.x, point.y - this.y);
	}
}

class Size {
	constructor(width = 0, height = 0) {
		this.width = width;
		this.height = height;
	}
}