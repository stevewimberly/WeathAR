import React, {FunctionComponent, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroParticleEmitter,
  ViroConstants,
  ViroDirectionalLight,
} from 'react-viro';

const windShear: number = 1.0;
const fallSpeed: number = 1.0;
const snowSpawnRate: number = 100;

const SnowCameraView: FunctionComponent = () => {
  const [text, setText] = useState<string>('Initializing AR...');

  const _onInitialized = (state: ViroConstants): void => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World');
    } else if (state === ViroConstants.TRACKING_REASON_NONE) {
      // Handle loss of tracking
    }
  };

  return (
    <ViroARScene
    // onTrackingUpdated={_onInitialized}
    >
      <ViroParticleEmitter
        key={'effect_snow'}
        position={[0, 4.5, 0]}
        duration={2000}
        visible={true}
        run={true}
        loop={true}
        fixedToEmitter={true}
        image={{
          source: require('../../assets/vrAr/particle_snow.png'), // Image source of the image particle.
          height: 0.01,
          width: 0.01,
        }}
        spawnBehavior={{
          particleLifetime: [5000, 5000],
          emissionRatePerSecond: [600, 600],
          spawnVolume: {
            shape: 'box',
            params: [20, 1, 20],
            spawnOnSurface: false,
          },
          maxParticles: 2000,
        }}
        particleAppearance={{
          opacity: {
            initialRange: [0, 0],
            factor: 'Time',
            interpolation: [
              {endValue: 1.0, interval: [0, 500]},
              {endValue: 0.0, interval: [4000, 5000]},
            ],
          },
          rotation: {
            initialRange: [0, 360],
            factor: 'Time',
            interpolation: [{endValue: 1080, interval: [0, 5000]}],
          },
          scale: {
            initialRange: [
              [5, 5, 5],
              [10, 10, 10],
            ],
            factor: 'Time',
            interpolation: [
              {endValue: [6, 6, 6], interval: [0, 1000]},
              {endValue: [10, 10, 10], interval: [3000, 5000]},
              {endValue: [5, 5, 5], interval: [4000, 5000]},
            ],
          },
        }}
        particlePhysics={{
          velocity: {
            initialRange: [
              [-2, -0.5, 0],
              [2, -3.5, 0],
            ],
          },
        }}
      />
    </ViroARScene>
  );
};

module.exports = SnowCameraView;
