'use strict';

import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroBox,
  ViroMaterials,
  ViroOrbitCamera,
  ViroAmbientLight,
  ViroSpotLight,
} from 'react-viro';

const HelloWorldSceneAR: FunctionComponent = () => {
  const [text, setText] = useState<string>('Initializing AR...');

  const _onInitialized = (state: ViroConstants): void => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World');
    } else if (state === ViroConstants.TRACKING_REASON_NONE) {
      // Handle loss of tracking
    }
  };

  return (
    // <View>
    <ViroARScene onTrackingUpdated={_onInitialized}>
      <ViroText
        text={text}
        // scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
      <ViroBox
        position={[0, -0.5, -1]}
        scale={[0.3, 0.3, 0.1]}
        materials={['grid']}
      />

      <ViroSpotLight
        position={[0, -0.25, 0]}
        color="#777777"
        direction={[0, 0, -1]}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        innerAngle={5}
        outerAngle={20}
      />

      <ViroAmbientLight color="#FF0000" />
      {/* <ViroBox
          position={[0, -0.5, -1]}
          scale={[0.3, 0.3, 0.1]}
          materials={['grid']}
        /> */}

      {/* Animation */}
      {/* <ViroBox
        position={[0, -0.5, -1]}
        scale={[0.3, 0.3, 0.1]}
        materials={['grid']}
        animation={{name: 'rotate', run: true, loop: true}}
      />

      <ViroAmbientLight color={'#aaaaaa'} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      /> */}
      {/* <Viro3DObject
           source={require('../assets/vrAr/emoji_smile/emoji_smile.vrx')}
            resources={[
              require('../assets/vrAr/emoji_smile/emoji_smile_diffuse.png'),
              require('../assets/vrAr/emoji_smile/emoji_smile_normal.png'),
              require('../assets/vrAr/emoji_smile/emoji_smile_specular.png'),
            ]}
          position={[-0.5, 0.5, -1]}
          scale={[0.2, 0.2, 0.2]}
          type="VRX"
        />
        <ViroARPlaneSelector /> */}
      {/* Make The Plane Selectable */}
      {/* <ViroARPlaneSelector>
          <Viro3DObject
           source={require('../assets/vrAr/emoji_smile/emoji_smile.vrx')}
            resources={[
              require('../assets/vrAr/emoji_smile/emoji_smile_diffuse.png'),
              require('../assets/vrAr/emoji_smile/emoji_smile_normal.png'),
              require('../assets/vrAr/emoji_smile/emoji_smile_specular.png'),
            ]}
            position={[0, 0.5, 0]}
            scale={[0.2, 0.2, 0.2]}
            type="VRX"
          />
        </ViroARPlaneSelector> */}
      {/* Make the node draggable */}
      {/* <ViroNode position={[0, -1, 0]} dragType="FixedToWorld" onDrag={() => {}}>
        <Viro3DObject
          source={require('../assets/vrAr/emoji_smile/emoji_smile.vrx')}
          resources={[
            require('../assets/vrAr/emoji_smile/emoji_smile_diffuse.png'),
            require('../assets/vrAr/emoji_smile/emoji_smile_normal.png'),
            require('../assets/vrAr/emoji_smile/emoji_smile_specular.png'),
          ]}
          position={[0, 0.5, 0]}
          scale={[0.2, 0.2, 0.2]}
          type="VRX"
        />
      </ViroNode> */}
      {/* <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.takeImageButton}
          // onPress={() => takePicture()}
        />
      </View> */}
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontSize: 12,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  takeImageButton: {
    height: 65,
    width: 65,
    backgroundColor: 'red',
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fff',
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('../assets/vrAr/grid_bg.jpg'),
    shininess: 2.0,
    lightingModel: 'Lambert',
  },
});

// ViroMaterials.createMaterials({
//   earth: {
//     shininess: 2.0,
//     lightingModel: 'Lambert',
//     diffuseTexture: require('./res/earth_texture.jpg'),
//   },
//   moon: {
//     shininess: 2.0,
//     lightingModel: 'Constant',
//     diffuseTexture: require('./res/moon_texture.jpg'),
//   },
// });

// ViroAnimations.registerAnimations({
//   rotate: {
//     properties: {
//       rotateY: '+=90',
//     },
//     duration: 250, //.25 seconds
//   },
// });

module.exports = HelloWorldSceneAR;
