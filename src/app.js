import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import GalleryItem from './components/GalleryItem'
import Gallery from './components/Gallery'
import './asset/app.sass'
import {Motion, spring} from 'react-motion'
import ViewTransform from './components/ViewTransform'

class GalleryItemDemo extends Component {
	render() {
		return (
			<div style={{display:"flex",flexDirection:"column"}}>
				<GalleryItem item={{
					original:require('./asset/2.jpg'),
					markers:[{
						source:require('./asset/floor.png'),
						style:{top:"100px",left:"100px"},
						onClick:()=>{
							alert('marker is clicked');
						}
					}]
				}}/>
			</div>
		);
	}
}

class GalleryDemo extends Component {
	render() {
		return (
			<div style={{flex:1,overflow:"hidden",justifyContent:"center",alignItems:"center",display:"flex"}}>
				<div>
					<Gallery
						showPlayButton={false}
						showNav={false}
						showThumbnails={false}
						showFullscreenButton={false}
						useBrowserFullscreen={false}
						items={[
					{
						original:'http://172.16.0.253:13002/ibuild/Original/2017/0727/4fda58cd-8f0b-4e2c-8f51-6688072056bd.png',
						markers:[
							{
								source:'http://172.16.0.253:13002/ibuild/sitemap_icon/location/env_monitor@2x.png',
								style:{width:"20px",height:"20px"},
								x:651.56,
								y:722.981,
								onClick:()=>{
									alert('click')
								}
							}
						]
					},
					/*{
						original:'http://172.16.0.253:13002/ibuild/Original/2017/0814/30528e25-0f9f-4527-8a4d-090aeeded7e7.png',
						markers:[{
							source:'http://172.16.0.253:13002/ibuild/sitemap_icon/location/construction_elevator@2x.png',
							style:{width:"20px",height:"20px"},
								x:236.16,
								y:228,
								onClick:()=>{
									alert('click')
								}
						},{
							source:"http://172.16.0.253:13002/ibuild/sitemap_icon/location/construction_elevator@2x.png",
							style:{width:"20px",height:"20px"},
								x:647.04,
								y:410.4,
								onClick:()=>{
									alert('click')
								}
						}]
					},*/
				]}/>
				</div>
			</div>
		);
	}
}

class MotionDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			left: 0
		};
	}

	render() {
		return (
			<Motion defaultStyle={{left: 0}} style={{left: spring(this.state.left)}}>
				{({left}) => {
					console.log(left)
					return (
						<div style={{
							width:"20px",
							height:"20px",
							backgroundColor:"red",
							transform:`translateX(${left}px)`}} onClick={()=>{
								this.setState({left:this.state.left===0?100:0})
							}}/>
					);
				}}
			</Motion>
		);
	}
}

class ViewTransformDemo extends Component {
	render() {
		return (
			<ViewTransform style={{backgroundColor:"silver",flex:1,justifyContent:"center",alignItems:"center"}}>
				<div>haha</div>
			</ViewTransform>
		);
	}
}


class Example extends Component {
	render() {
		return (
			<GalleryDemo></GalleryDemo>
		);
	}
}

ReactDOM.render(
	<Example></Example>
	, document.getElementById("view"));