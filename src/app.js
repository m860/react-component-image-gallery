import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import GalleryItem from './components/GalleryItem'
import './asset/app.sass'
import {Motion,spring} from 'react-motion'

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

class MotionDemo extends Component{
	constructor(props){
		super(props);
		this.state={
			left:0
		};
	}
	render(){
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


class Example extends Component {
	constructor(props) {
		super(props);
		this.state = {
			images: [
				{original: require('./asset/2.jpg')},
				{original: require('./asset/3.jpg')},
				{original: require('./asset/4.jpg')},
			]
		};
	}

	render() {
		return (
			<div>
			<GalleryItemDemo/>
				<h5>motion demo</h5>
				<MotionDemo/>
			</div>
		);
	}
}

ReactDOM.render(
	<Example></Example>
	, document.getElementById("view"));