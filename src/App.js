import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai'; 
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
   apiKey:'bc6b4866d9264cd1a63dd24c71c9d14b' 
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component { 
    
constructor() {
    super();
    this.state = initialState;
  }
    
loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
}
onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
    
onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
        .then(response =>{
        this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data.regions[0].region_info.bounding_box))
        this.displayFaceBox1(this.calculateFaceLocation(response.outputs[0].data.regions[1].region_info.bounding_box))
        this.displayFaceBox2(this.calculateFaceLocation2(response.outputs[0].data.regions[2].region_info.bounding_box))
        })                                  
        .catch((err) => console.log(err)); 
  }
calculateFaceLocation = (data) => {
    console.log(data);
    const clarifaiFace = data;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

displayFaceBox = (box) => {
        console.log(box)

    this.setState({box: box});
  }
displayFaceBox1 = (box1) => {
    console.log(box1)
    this.setState({box1: box1});
  }
displayFaceBox2 = (box2) => {
    console.log(box2)
    this.setState({box2: box2});
  }
onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
        params={particlesOptions}
        />
        <Navigation 
            isSignedIn={this.state.isSignedIn}
            onRouteChange={this.onRouteChange}
        />
        {   this.state.route === 'home'
            ? <div>
                <Logo />
                <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
                />
                <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition
                imageUrl={this.state.imageUrl}
                box={this.state.box}
                box1={this.state.box1}
                box2={this.state.box2}
                />
              </div>
            :(
                this.state.route==='signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             )
        }   
      </div>
    );
  }
}

export default App;