/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { Camera } from 'expo-camera';

import * as FaceDetector from 'expo-face-detector';

//import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { AntDesign } from '@expo/vector-icons';
//import axios from "axios"

// import { Player } from '@react-native-community/audio-toolkit';
// import SoundPlayer from 'react-native-sound-player'
// var Sound = require('react-native-sound');
import { Audio } from 'expo-av';

// const filename = './audio/welcome.mp3'
const soundObject = new Audio.Sound();


class App extends Component {
  
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.front,
    faces: [],
    picture: null,
    hasMask: false,
    audioPlaying: true,
    tooclose: false,
    dist: 0,
  }

  model
  hasFaceMask = false

  componentWillMount(){
    console.disableYellowBox = true;
    (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        // Get permission
        this.setState({hasPermission: status === 'granted'});

        // Load audio for welcome screen and warning
        await soundObject.loadAsync(require('./tooclose.mp3'));
        Audio.setAudioModeAsync({playsInSilentModeIOS : true})

        // Welcome audio
        const playback = await Audio.Sound.createAsync(
              require('./welcome.mp3'),
              { shouldPlay: true }
            )
    })();
  }


  onFacesDetected = (obj) => {
    //if(obj.faces[0])console.log(obj.faces[0].noseBasePosition)
    this.setState({ faces: obj.faces });

    // if too close, play the audio
    if (this.state.dist > 5000 && this.state.audioPlaying) {
      this.setState({audioPlaying: false});
      this.playSound();
    }

    // send pic to backend to process
    setTimeout(async () => {
      let photo = await this.camera.takePictureAsync({base64: true});
      console.log(this.hasFaceMask)
      // console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
      //console.log(photo.uri)
      //Do the api call
      
      //console.log(photo.base64);

      postImage = ((photo) => {

        return fetch('http://localhost:5000/path', {
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({uri: photo.uri, base64: photo.base64})
      }).then(response => {
        response.json();
      }).then(resJSON => {
        this.hasFaceMask = resJSON['class id'] == 1 ? false : true
        //return resJSON
      }).catch(error => {
        console.log("FANCY")
        console.log(error)
      })

        // let response = await fetch('http://127.0.0.1:5000/', {
        //     method: "POST",
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     }, 
        //     body: JSON.stringify({uri: photo.uri, base64: photo.base64})
        // })
        // let json = await response.json()
        // return json
      });

    }, 1000)
  }


  playSound = () => {
      soundObject.playAsync();
      soundObject.replayAsync();
      setTimeout(() => {
        this.setState({audioPlaying: true});
        }, 4000);
  }

  renderFaces = () => 
  <View style={styles.facesContainer} pointerEvents="none">
    {this.state.faces.map(this.renderFace)}
  </View>


  renderFace = ({ bounds, faceID, rollAngle, yawAngle,leftCheekPosition,leftMouthPosition, noseBasePosition, rightCheekPosition, rightMouthPosition }) => {
    const size = bounds.size.height * bounds.size.width; // compute face size to determine approximate distance
    setTimeout(() => {
      this.setState({ dist: size });
      }, 1000);
    let styleOpt;
    if(size > 5000 && !this.hasFaceMask){
      styleOpt = styles.face_warning
    } else if (this.hasFaceMask) {
      styleOpt = styles.face_success
    } else {
      styleOpt = styles.face
    }

    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styleOpt,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={styles.faceText}>hasMask: {this.hasFaceMask ? "Yes" : "No"}</Text>
        <Text style={styles.faceText}>Close: {size > 5000 ? "Yes" : "No"}</Text>

      </View>
    );
  }

  render(){

    if (this.state.hasPermission === null) {
      return <View />;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }else return (
      <View style={{ flex: 1 }}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }} 
          type={this.state.type}
          onFacesDetected={this.onFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
          >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                if(this.state.type === Camera.Constants.Type.back){
                  this.setState({type: Camera.Constants.Type.front});
                }else{
                  this.setState({type: Camera.Constants.Type.back})
                }
              }}>
  
              <AntDesign name="retweet" size={80} style={{marginLeft: 100, width: 100}} color="black" />
              
            </TouchableOpacity>
          </View>
        </Camera>
        {this.renderFaces()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  face_warning: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FF0000',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  face_success: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#00FF00',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
});

export default App;