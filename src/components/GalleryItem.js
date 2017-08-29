import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import GalleryMarker from './GalleryMarker'
import Transition from 'react-transition-group/Transition'
import {Motion, spring} from 'react-motion'

export default class GalleryItem extends PureComponent {
	static propTypes = {
		item: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this._width = null;
		this._height = null;
		this.state = {
			scale: 1
		};
	}

	_zoom(scale) {
		this.setState(
			Object.assign({}, this.state, {
				scale
			}),()=>{
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

	_getContainerWidth(){
		const {root}=this.refs;
		return root.clientWidth;
	}

	_getContainerHeight(){
		const {root}=this.refs;
		return root.clientHeight;
	}

	render() {
		return (
			<div ref="root">
				<Motion defaultStyle={{scale:1}} style={{scale:spring(this.state.scale)}}>
					{({scale})=> {
						return (
							<img
								style={{transform:`scale(${scale})`}}
								onLoad={({target})=>{
									this._width=target.width;
									this._height=target.height;
								}}
								src={this.props.item.original}/>
						);
					}}
				</Motion>
				<div
					className="debug-zoom-buttons">
					<button type="button" onClick={()=>{
						this._zoom(this.state.scale-0.1);
					}}>zoom in
					</button>
					<button type="button" onClick={()=>{
						this._zoom(this.state.scale+0.1)
					}}>zoom out
					</button>
				</div>
			</div>
		);
	}

	componentDidMount() {
		console.log(`container width=${this._getContainerWidth()},height=${this._getContainerHeight()}`)
	}
}
