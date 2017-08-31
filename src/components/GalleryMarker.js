import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Motion, spring} from 'react-motion'

export default class GalleryMarker extends PureComponent {
	static propTypes = {
		source: PropTypes.any.isRequired,
		style: PropTypes.object,
		onClick: PropTypes.func,
		defaultX: PropTypes.number,
		defaultY: PropTypes.number,
		x: PropTypes.number,
		y: PropTypes.number
	};
	static defaultProps = {
		onClick: ()=>null,
		style: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			opacity: 0
		};
	}

	render() {
		const src = this.props.source.constructor.name === "Object" ? this.props.source.uri : this.props.source;
		const style = Object.assign({}, this.props.style, {
			position: "absolute"
		});
		return (
			<Motion
				onRest={()=>{
					const state=Object.assign({},this.state,{
						opacity:1
					});
					this.setState(state);
				}}
				style={{x:spring(this.props.x),y:spring(this.props.y)}}
				defaultStyle={{x:this.props.defaultX,y:this.props.defaultY}}>
				{({x, y})=> {
					return (
						<img
							style={{...style,top:`${y}px`,left:`${x}px`,opacity:this.state.opacity}}
							onClick={this.props.onClick}
							src={src}/>
					);
				}}
			</Motion>

		);
	}
}
