import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import ImageGallery from 'react-image-gallery'
import GalleryItem from './GalleryItem'
import "react-image-gallery/styles/css/image-gallery.css"

/**
 * Gallery - 画廊,支持缩放,支持marker
 *
 * 组件缩放/移动/marker的特性是通过renderItem来实现的,因此请不要对renderItem方法进行重写.
 *
 * @example
 *
 *  class GalleryDemo extends Component {
 * 	render() {
 * 		return (
 * 			<Gallery
 * 				showPlayButton={false}
 * 				showNav={false}
 * 				showThumbnails={false}
 * 				showFullscreenButton={false}
 * 				useBrowserFullscreen={false}
 * 				items={[
 * 					{
 * 						original:require('./asset/2.jpg'),
 * 						markers:[
 * 							{
 * 								source:require('./asset/floor.png'),
 * 								style:{width:"20px",height:"20px"},
 * 								x:10,
 * 								y:10,
 * 								onClick:()=>{
 * 									alert('click')
 * 								}
 * 							}
 * 						]
 * 					},
 * 					{original:require('./asset/3.jpg')},
 * 					{original:require('./asset/4.jpg')}
 * 				]}/>
 * 		);
 * 	}
 * }
 * */
export default class Gallery extends PureComponent {
	/**
	 * {@link https://github.com/xiaolin/react-image-gallery#props ...react-image-gallery.props }
	 * @property {?Object} style
	 * @property {?String} className
	 * @property {?Number} minScale [1] - 最小缩放
	 * @property {?Number} maxScale [3] - 最大缩放
	 * */
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		minScale: PropTypes.number,
		maxScale: PropTypes.number,
		itemOptions: PropTypes.shape({
			style: PropTypes.object,
			className: PropTypes.string,
			scaleRate: PropTypes.number
		})
	};
	static defaultProps = {
		itemOptions: {}
	};

	constructor(props) {
		super(props);
		this._prevItem = null;
	}

	render() {
		return (
			<ImageGallery {...this.props}
				renderItem={(item)=>{
					return (
						<GalleryItem {...this.props.itemOptions}
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
