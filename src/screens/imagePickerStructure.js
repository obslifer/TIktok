import React, {Fragment, Component} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

export default class ImageEnvoie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUri: '',
      mediaType: '',
    };
  }

  chooseImageOrVideo = () => {
    const options = {
      mediaType: 'mixed',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled picker');
      } else if (response.errorCode) {
        console.log('Picker Error: ', response.errorMessage);
      } else {
        this.setState({
          fileUri: response.assets[0].uri,
          mediaType: response.assets[0].type,
        });
      }
    });
  };

  renderFileUri() {
    if (this.state.fileUri) {
      return (
        <View>
          {this.state.mediaType.startsWith('video') ? (
            <Video
              source={{uri: this.state.fileUri}}
              style={styles.media}
              controls={true}
            />
          ) : (
            <Image source={{uri: this.state.fileUri}} style={styles.media} />
          )}
        </View>
      );
    } else {
      return (
        <Image source={require('../assets/dummy.png')} style={styles.media} />
      );
    }
  }

  render() {
    return (
      <View >
        <View style={styles.ImageSections}>{this.renderFileUri()}</View>
        <View style={styles.btnParentSection}>
          <TouchableOpacity style={styles.btnSection}>
            <Text>Publier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.chooseImageOrVideo}
            style={styles.btnSection}>
            <Text>Choisir une photo/video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  ImageSections: {
    flexDirection: 'column',
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: 400,
    height: 1000,
    borderColor: 'black',
    //borderWidth: 1,
    marginVertical: 10,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 0, // Adjust as per your UI design
    left: 0,
    right: 0,
    alignItems: 'center',
    //flexDirection: "row"
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
    
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 10,
  },
});
