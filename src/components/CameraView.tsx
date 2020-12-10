import React, {FunctionComponent, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroBox,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  ViroAnimations,
} from 'react-viro';

const CameraView: FunctionComponent = () => {
  const [text, setText] = useState<string>('Initializing AR...');

  const _onInitialized = (state: ViroConstants): void => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World');
    } else if (state === ViroConstants.TRACKING_REASON_NONE) {
      // Handle loss of tracking
    }
  };

  return (
    <ViroARScene onTrackingUpdated={_onInitialized}>
      <ViroText
        text={text}
        // scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.textStyle}
      />
      {/* <ViroBox
          position={[0, -0.5, -1]}
          scale={[0.3, 0.3, 0.1]}
          materials={['grid']}
        /> */}

      {/* Animation */}
      <ViroBox
        position={[0, -0.5, -1]}
        scale={[0.3, 0.3, 0.1]}
        materials={['grid']}
        animation={{name: 'rotate', run: true, loop: true}}
      />

      <ViroAmbientLight color={'#000000'} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#000000"
        castsShadow={true}
      />
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
      <ViroNode position={[0, -1, 0]} dragType="FixedToWorld" onDrag={() => {}}>
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
      </ViroNode>
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    color: '#fff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('../assets/vrAr/grid_bg.jpg'),
  },
});

ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: '+=90',
    },
    duration: 250, //.25 seconds
  },
});

module.exports = CameraView;
