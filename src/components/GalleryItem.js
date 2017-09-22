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

	static propTypes = {
		item: PropTypes.object.isRequired,
		minScale: PropTypes.number,
		maxScale: PropTypes.number,
		style: PropTypes.object,
		className: PropTypes.string,
		scaleRate: PropTypes.number
	};

	static defaultProps = {
		minScale: 1,
		maxScale: 3,
		style: {},
		className: '',
		scaleRate: 100
	};


	constructor(props) {
		super(props);
		this._actionType = actionType.none;
		this._touchStart = false;
		this._lastTouches = [];
		this._mounted = false;
		this.state = {
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
	}

	_getRealWidth() {
		return this.state.width * this.state.scale;
	}

	_getRealHeight() {
		return this.state.height * this.state.scale;
	}

	_getContainerWidth() {
		const {root}=this.refs;
		if (root) {
			return root.clientWidth;
		}
		return 0;
	}

	_getContainerHeight() {
		const {root}=this.refs;
		if (root) {
			return root.clientHeight;
		}
		return 0;
	}

	_getMovingRegion(scale) {
		const width = this.state.width * scale;
		const height = this.state.height * scale;
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
			bottom: offsetY,
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
		const region = this._getMovingRegion(this.state.scale);
		if (newState.x <= region.right && newState.x >= region.left) {
			event.stopPropagation();
			this.setState(newState);
		}
	}

	_getDistance(touches) {
		const touch1 = touches[0];
		const touch2 = touches[1];
		return Math.sqrt(Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2));
	}

	_scale(event) {
		const dis1 = this._getDistance(event.targetTouches);
		const dis2 = this._getDistance(this._lastTouches);
		this._lastTouches = event.targetTouches;

		const diff = dis1 - dis2;
		const scale = diff / this.props.scaleRate;
		const targetScale = this.state.scale + scale;
		const state = Object.assign({}, this.state, {
			scale: targetScale > 0.1 ? targetScale : 0.1,
		});
		this.setState(state);
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
		if (scale < this.props.minScale) {
			scale = this.props.minScale;
		}
		else if (scale > this.props.maxScale) {
			scale = this.props.maxScale;
		}
		const state = Object.assign({}, this.state, {x, y, scale, useSpring: true});
		this.setState(state);
	}

	reset() {
		if (this._mounted) {
			this.setState(
				Object.assign({}, this.state, {
					x: 0,
					y: 0,
					scale: 1
				})
			)
		}
	}

	render() {
		if (!this.state.imageIsReady) {
			return null;
		}
		const markers = this.props.item.markers || [];
		return (
			<div className={this.props.className} style={{...this.props.style, position:"relative"}} ref="root">
				<Motion
					defaultStyle={{scale:1,x:0,y:0}}
					onRest={()=>{
						const state=Object.assign({},this.state,{
							useSpring:false
						});
						this.setState(state);
					}}
					style={{
						scale:this.state.useSpring?spring(this.state.scale):this.state.scale,
						x:this.state.useSpring?spring(this.state.x/this.state.scale):this.state.x/this.state.scale,
						y:this.state.useSpring?spring(this.state.y/this.state.scale):this.state.y/this.state.scale
					}}>
					{({scale, x, y})=> {
						return (
							<img
								style={{transform:`scale(${scale}) translate(${x}px,${y}px)`,transformOrigin:"center center"}}
								onLoad={(event)=>{
									console.log('image loaded')
									const {target}=event;
									const computedStyle=window.getComputedStyle(target);
									const width=parseFloat(computedStyle.width);
									const height=parseFloat(computedStyle.height);
									const state=Object.assign({},this.state,{
										width:width,
										height:height,
										//counter:this.state.counter+1,
										initialScale:width/this.state.originalSize.width,
										canRenderMarkers:true
									});
									this.setState(state);
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
				{this.state.canRenderMarkers && markers.map((marker, index)=> {
					const containerWidth = this._getContainerWidth();
					const containerHeight = this._getContainerHeight();
					const imageRealWidth = this._getRealWidth();
					const imageRealHeight = this._getRealHeight();
					console.log(`container width=${containerWidth},image width=${containerHeight}`);
					console.log(`image width=${imageRealWidth},image height=${imageRealHeight}`);
					const diff = {
						x: (containerWidth - imageRealWidth) / 2,
						y: (containerHeight - imageRealHeight) / 2
					};
					console.log(`diff x=${diff.x},y=${diff.y}`)
					let x = marker.x * this.state.initialScale;
					//+偏移
					x *= this.state.scale;
					x += diff.x;
					x += this.state.x;
					let y = marker.y * this.state.initialScale;
					y *= this.state.scale;
					y += this.state.y;
					y += diff.y;
					return (
						<GalleryMarker {...marker} key={index} x={x} y={y} defaultX={marker.x}
												   defaultY={marker.y}/>
					);
				})}
				{/*
				 <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",justifyContent:"center"}}>
				 <button type="button" onClick={()=>{
				 const state=Object.assign({},this.state,{
				 scale:this.state.scale+0.1
				 });
				 this.setState(state);
				 }}>放大
				 </button>
				 <button type="button" onClick={()=>{
				 const state=Object.assign({},this.state,{
				 scale:this.state.scale-0.1
				 });
				 this.setState(state);
				 }}>缩小
				 </button>
				 </div>
				 */}
			</div>
		);
	}

	_loadImageComplete(err, event) {
		const imageOriginalSize = {
			width: event.target.width,
			height: event.target.height
		};
		console.log(`image original size : ${JSON.stringify(imageOriginalSize)}`)
		const state = Object.assign({}, this.state, {
			imageIsReady: true,
			originalSize: imageOriginalSize
		});
		this.setState(state);
	}

	componentDidMount() {
		this._mounted = true;
		let image = new Image();
		image.src = this.props.item.original;
		image.onload = (event)=> {
			this._loadImageComplete(null, event);
		};
		image.onerror = (err)=> {
			this._loadImageComplete(err);
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}
}
