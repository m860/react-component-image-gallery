import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import ImageGallery from 'react-image-gallery'
import GalleryItem from './GalleryItem'
import "react-image-gallery/styles/css/image-gallery.css"

/**
 * Gallery - 画廊,支持缩放,支持marker
 * */
export default class Gallery extends PureComponent {
	/**
	 * @property {?Object} style
	 * @property {?String} className
	 * */
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		minScale: PropTypes.number,
		maxScale: PropTypes.number
	};
	static defaultProps = {};

	constructor(props) {
		super(props);
		this._prevItem = null;
	}

	render() {
		return (
			<ImageGallery {...this.props}
				ref={component=>this.gallery=component}
				renderItem={(item)=>{
					return (
						<GalleryItem
							ref={component=>{
								if(this._prevItem){
									this._prevItem.reset();
								}
								this._prevItem=component;
							}}
							item={item}
							maxScale={this.props.maxScale}
							minScale={this.props.minScale}/>
					);
				}}
			/>
		);
	}

}
