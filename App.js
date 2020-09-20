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

// import { Player } from '@react-native-community/audio-toolkit';
// import SoundPlayer from 'react-native-sound-player'
// var Sound = require('react-native-sound');
import { Audio } from 'expo-av';

// const filename = './audio/welcome.mp3'
const soundObject = new Audio.Sound();


class App extends Component {
  
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
    faces: [],
    picture: null,
    hasMask: false,
    audioPlaying: true
  }

  model

  componentWillMount(){
    (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        //Get permission
        this.setState({hasPermission: status === 'granted'});
        await soundObject.loadAsync(require('./watchout.mp3'));
        const playback = await Audio.Sound.createAsync(
              require('./welcome.mp3'),
              { shouldPlay: true }
            )
    })();
  }

  onFacesDetected = (obj) => {
    //if(obj.faces[0])console.log(obj.faces[0].noseBasePosition)
    this.setState({ faces: obj.faces });
    //console.log(this.state.audioPlaying);
    if (this.state.audioPlaying) {
      //console.log('play sound')
      this.setState({audioPlaying: false});
      this.playSound();
    }

    setTimeout(async () => {
      let photo = await this.camera.takePictureAsync({base64: true});
      console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
      //console.log(photo.uri)
      //Do the api call


    }, 1000)
  }
  
  // playSound = () => {
  //   (async () => {
  //     await soundObject.playAsync();
  //     await soundObject.replayAsync();
  //   })();
  // }

  playSound = () => {
      //console.log(this.state.audioPlaying);
      soundObject.playAsync();
      soundObject.replayAsync();
      setTimeout(() => {
        this.setState({audioPlaying: true});
        }, 3000);
      //console.log(this.state.audioPlaying);
  }

  // playSound = () => {
  //   const soundObject = new Audio.Sound();
  //   try {
  //     soundObject.loadAsync(require('./welcome.mp3'));
  //     soundObject.setVolumeAsync(0.9)
  //     soundObject.playAsync();
  //     console.log()
  //     soundObject.replayAsync();
      
  //     // Your sound is playing!

  //     // Don't forget to unload the sound from memory
  //     // when you are done using the Sound object
  //     soundObject.unloadAsync();
  //     console.log('works')
  //   } catch (error) {
  //     // An error occurred!
  //     console.log(error)
  //   }
  // }

  // handleFacesDetected(obj){
  //   this.updateFaces(obj)
  //   console.log(obj);
  // }

  renderFaces = () => 
  <View style={styles.facesContainer} pointerEvents="none">
    {this.state.faces.map(this.renderFace)}
  </View>

  renderFace({ bounds, faceID, rollAngle, yawAngle,leftCheekPosition,leftMouthPosition, noseBasePosition, rightCheekPosition, rightMouthPosition }) {
    const size = bounds.size.height * bounds.size.width;
    let styleOpt;
    if(size > 5000){
      styleOpt = styles.face
    }else{
      styleOpt = styles.face_warning
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
        <Text style={styles.faceText}>size: {size}</Text>

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
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
});

export default App;