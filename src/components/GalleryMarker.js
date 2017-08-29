import React, {PureComponent} from "react";
import PropTypes from "prop-types";

export default class GalleryMarker extends PureComponent {
	static propTypes = {
		source: PropTypes.any.isRequired,
		style: PropTypes.object,
		onClick: PropTypes.func,
		x:PropTypes.number,
		y:PropTypes.number
	};
	static defaultProps = {
		onClick: ()=>null,
		style: {}
	};

	constructor(props) {
		super(props);
	}

	render() {
		const src = this.props.source.constructor.name === "Object" ? this.props.source.uri : this.props.source;
		const style = Object.assign({}, this.props.style, {
			position: "absolute",
			top:`${this.props.y}px`,
			left:`${this.props.x}px`
		});
		return (
			<img
				style={style}
				onClick={this.props.onClick}
				src={src}/>
		);
	}

	componentDidMount() {

	}
}
