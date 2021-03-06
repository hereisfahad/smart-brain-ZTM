import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Particles from "react-particles-js";
import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Clarifai from "clarifai";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

const app = new Clarifai.App({
  apiKey: "bc6b4866d9264cd1a63dd24c71c9d14b"
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
};
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  // route: "home",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  },
  fullScreen: false
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.date
      }
    });
  };
  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input }, () => {
      fetch("https://vast-forest-29631.herokuapp.com/image", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(response => response.json())
        .then(data => {
          this.setState(state => (state.user.entries = data.entries));
        })
        .catch(err => console.log(err));
      app.models
        .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => {
          this.displayFaceBox(
            this.calculateFaceLocation(
              response.outputs[0].data.regions[0].region_info.bounding_box
            )
          );
        });
    });
  };
  calculateFaceLocation = data => {
    // console.log(data);
    const clarifaiFace = data;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    // console.log(box);
    this.setState({ box: box });
  };
  deleteUser = async () => {
    try {
      const resp = await fetch(
        " https://vast-forest-29631.herokuapp.com/delete",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.state.user.id
          })
        }
      );
      console.log(resp);
      const data = await resp.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };
  toggleFullScreen = () => {
    if (!this.state.fullScreen) {
      document.documentElement.requestFullscreen();
      this.setState({ fullScreen: true });
    } else {
      document.exitFullscreen();
      this.setState({ fullScreen: false });
    }
  };
  render() {
    const { isSignedIn, imageUrl, route, box, user } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          deleteUser={this.deleteUser}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              value
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              box={box}
              // box1={this.state.box1}
              // box2={this.state.box2}
            />
            <i
              className="fas fa-compress"
              onClick={() => this.toggleFullScreen()}
            ></i>
          </div>
        ) : route === "test" ? (
          <div>
            <Logo />
            <p
              className="tooltip"
              style={{ outline: "none", color: "#E1E1E1" }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              onClick={e => {
                document.execCommand("selectAll");
                document.execCommand("copy");
              }}
            >
              <span className="tooltiptext" contentEditable="false">
                Click To Copy
              </span>
              https://images.unsplash.com/photo-1542080681-b52d382432af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80
            </p>
            <ImageLinkForm
              value
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box} />
            <i
              className="fas fa-compress"
              onClick={() => this.toggleFullScreen()}
            ></i>
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
        <i
          className="fas fa-compress"
          onClick={() => this.toggleFullScreen()}
        ></i>
      </div>
    );
  }
}

export default App;
