import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import GalleryMarker from './GalleryMarker'
import {Motion, spring} from 'react-motion'

const actionType = {
	none: 0,
	scaling: 1,
	moving: 2
};

export default class GalleryItem extends PureComponent {
	_actionType: actionType;
	_width: Number;
	_height: Number;
	_img: HTMLElement

	static propTypes = {
		item: PropTypes.object.isRequired
	};


	constructor(props) {
		super(props);
		this._width = null;
		this._height = null;
		this._actionType = actionType.none;
		this._touchStart = false;
		this._lastTouches = [];
		this._img = null;
		this.state = {
			scale: 1,
			x: 0,
			y: 0
		};
	}

	_zoom(scale) {
		this.setState(
			Object.assign({}, this.state, {
				scale
			}), ()=> {
				console.log(`image real width : ${this._getRealWidth()},real height : ${this._getRealHeight()}`);
				console.log(`container width=${this._getContainerWidth()},height=${this._getContainerHeight()}`)
			}
		)
	}

	_getRealWidth() {
		return this._width * this.state.scale;
	}

	_getRealHeight() {
		return this._height * this.state.scale;
	}

	_getContainerWidth() {
		const {root}=this.refs;
		return root.clientWidth;
	}

	_getContainerHeight() {
		const {root}=this.refs;
		return root.clientHeight;
	}

	_getMovingRegion(scale) {
		const width = this._width * scale;
		const height = this._height * scale;
		const hw = width / 2;
		const hh = height / 2;
		const containerWidth = this._getContainerWidth();
		const containerHeight = this._getContainerHeight();
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
			bottom: offsetY
		};
	}


	_moving(event) {
		//event.preventDefault();
		//event.stopPropagation();
		const touch = event.targetTouches[0];
		const lastTouch = this._lastTouches[0];
		const diff = {
			x: touch.pageX - lastTouch.pageX,
			y: touch.pageY - lastTouch.pageY
		};
		this._lastTouches = [touch];

		const newState = Object.assign({}, this.state, {
			x: this.state.x + diff.x,
			y: this.state.y + diff.y
		});
		const region=this._getMovingRegion(this.state.scale);
		if(newState.x<=region.right && newState.x>=region.left){
			event.stopPropagation();
			this.setState(newState);
		}
	}

	_scale(event) {
		//TODO
	}

	_restore(event) {
		let x = this.state.x;
		let y = this.state.y;
		let scale = this.state.scale;
		const region = this._getMovingRegion(this.state.scale);
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
		const state = Object.assign({}, this.state, {x, y, scale});
		this.setState(state);
	}

	render() {
		return (
			<div ref="root">
				<Motion
					onRest={()=>{
						//TODO
					}}
					defaultStyle={{scale:1,x:0,y:0}}
					style={{scale:spring(this.state.scale),x:spring(this.state.x/this.state.scale),y:spring(this.state.y/this.state.scale)}}>
					{({scale, x, y})=> {
						return (
							<img
								ref={img=>this._img=img}
								style={{transform:`scale(${scale}) translate(${x}px,${y}px)`,transformOrigin:"center center"}}
								onLoad={({target})=>{
									this._width=target.width;
									this._height=target.height;
								}}
								onTouchStart={event=>{
									this._touchStart=true;
									event.persist();
									this._lastTouches=event.targetTouches;
									if(this._lastTouches.length>=2){
										this._actionType=actionType.scaling;
									}
									else{
										this._actionType=actionType.moving;
									}
								}}
								onTouchMove={(event)=>{
									event.preventDefault();
									if(this._touchStart){
										event.persist();
										if(this._actionType===actionType.scaling){
											this._scale(event);
										}
										else{
											this._moving(event);
										}
									}
								}}
								onTouchEnd={event=>{
									this._touchStart=false;
									this._lastTouches=[];
									this._actionType=actionType.none;
									this._restore(event);
								}}
								src={this.props.item.original}/>
						);
					}}
				</Motion>
				<div
					className="debug-zoom-buttons">
					<button type="button" onClick={()=>{
						this._zoom(1);
					}}>1x
					</button>
					<button type="button" onClick={()=>{
						this._zoom(2)
					}}>2x
					</button>
					<button type="button" onClick={()=>{
						this._zoom(3)
					}}>3x
					</button>
				</div>
			</div>
		);
	}
}
