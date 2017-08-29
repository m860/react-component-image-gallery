import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"

class GalleryItem extends PureComponent{
	static propTypes={
		item:PropTypes.object.isRequired
	};
	render(){
		return (
			<div>
				<img src={this.props.item.original}/>
			</div>
		);
	}
}

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
	};
	static defaultProps = {
	};

	constructor(props) {
		super(props);
		this.gallery=null;
		this.preClickTime=null;
		this._scale=1;
	}

	getImg(){
		return this.gallery._imageGallery.querySelector("div.center img");
	}

	getImgRealWidth(){
		//TODO
	}
	getImgRealHeight(){
		//TODO
	}
	getImgScale(){
		//TODO
	}

	render() {
		return (
			<ImageGallery {...this.props}
				ref={component=>this.gallery=component}
				renderItem={(item)=>{
					return (
						<GalleryItem item={item}/>
					);
				}}
				/>
		);
	}

	// componentDidMount(){
	// 	const elImages=this.gallery._imageGallery.querySelectorAll("image-gallery-slides img");
	// 	elImages.forEach(img=>{
	// 		img.addEventListener('click')
	// 	})
	// }
}
