import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/navigation';
import Signin from './components/signin/signin';
import Register from './components/register/register';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/imagelinkform/imagelinkform';
import Rank from './components/rank/rank';
import FaceRecognition from './components/facerecognition/facerecognition';


import { Component } from 'react';


const particlesOptions = {
  particles: {
    number: {
      value:30,
      density: {
        enable: true,
        value_area:800
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    } 
  }
}

const initialstate = {
  input: '',
  imageurl: '',
  box: {},
  route: 'signin',
  isSignedin: false,
  user: {
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor(){
    super();
    this.state= initialstate;
  }
  
  loadUser = (data) => {
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  calculatefacelocation = (data) => {
    
    const datajson = JSON.parse(data);
    const clarifaiFace = datajson.outputs[0].data.regions[0].region_info.bounding_box
    
    const image = document.getElementById('inputimg')
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width) ,
      top_row: clarifaiFace.top_row * height,
      bottom_row: height - (clarifaiFace.bottom_row * height),
    }

  }

  displayfacebox = (box) => {
    this.setState({box: box})
    console.log(box);
  }

  oninputchange = (e) => {
    this.setState({input: e.target.value})
  }

  onbuttonsubmit = () => {
    this.setState({imageurl: this.state.input})

    const raw = JSON.stringify({
      "user_app_id": {
            "user_id": "user id",
            "app_id": "app id"
        },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.input
            }
          }
        }
      ]
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key your api key testing change asd'
      },
      body: raw
    };
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
      .then(response => response.text())
      
      //.then(result => console.log(JSON.parse(result, null, 2).outputs[0].data.regions[0].region_info.bounding_box))
      .then(result => {
        if (result){
          fetch('http://localhost:3001/image', {
            method:'put',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries:count}))
          })
          .catch(console.log)
        }
        
        this.displayfacebox(this.calculatefacelocation(result))
      })
      .catch(error => console.log('error', error));

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialstate)
    } else if (route === 'home'){
      this.setState({isSignedin: true})
    }

    this.setState({route:route})
  }

  render(){
  const { isSignedin, imageurl, route, box}= this.state; //destructured so you dont have to say this.state for everything below.
  return (
    <div className="App">
      
      <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
      {route === 'home' 
      ? <div>
      <Logo />
      <Rank name= {this.state.user.name} entries= {this.state.user.entries} />
      <ImageLinkForm  oninputchange={this.oninputchange} onbuttonsubmit={this.onbuttonsubmit} /> 
      <FaceRecognition box={box} imageurl={imageurl}/>
      </div>
      
      
      : (
        route === 'signin' ?
        <Signin loadUser= {this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser= {this.loadUser} onRouteChange={this.onRouteChange}/>
      )
      
      }
    <Particles className='particles'
              params={particlesOptions}
      />
    </div>
  );
}
}

export default App;
