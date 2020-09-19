/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Camera } from 'expo-camera';

import * as FaceDetector from 'expo-face-detector';

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 


class App extends Component {
  // const [hasPermission, setHasPermission] = useState(null);
  // const [type, setType] = useState(Camera.Constants.Type.back);
  // const [faces, setFaces] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back
  }

  componentWillMount(){
    (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        this.setState({hasPermission: status === 'granted'});
    })();
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
          style={{ flex: 1 }} 
          type={this.state.type}
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
});

export default App;
