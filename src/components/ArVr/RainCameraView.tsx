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

const RainCameraView: FunctionComponent = () => {
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
        key={'effect_bubbles'}
        // position={[0, -5.0, 0]}
        position={[0, 4.5, 0]}
        duration={5000}
        visible={true}
        delay={0}
        run={true}
        loop={true}
        fixedToEmitter={true}
        image={{
          source: require('../../assets/vrAr/particle_bubble.png'), // Image source of the image particle.
          height: 0.1,
          width: 0.1,
        }}
        spawnBehavior={{
          particleLifetime: [14000, 14000],
          emissionRatePerSecond: [80, 150], // or 300 with a max of 2000
          spawnVolume: {
            shape: 'box',
            params: [15, 1, 15],
            spawnOnSurface: false,
          },
          maxParticles: 2000,
        }}
        particleAppearance={{
          opacity: {
            initialRange: [0.0, 0.0],
            factor: 'Time',
            interpolation: [
              {endValue: 1.0, interval: [0, 500]},
              {endValue: 0.0, interval: [13700, 14000]},
            ],
          },
          scale: {
            initialRange: [
              [1, 1, 1],
              [1, 1, 1],
            ],
            factor: 'Time',
            interpolation: [
              {endValue: [1.5, 1.5, 1.5], interval: [4000, 9700]},
              {endValue: [3, 3, 3], interval: [13700, 14000]},
            ],
          },
        }}
        particlePhysics={{
          velocity: {
            initialRange: [
              [-0.5, 0.7, 0],
              [2, -3.5, 0],
            ],
          },
          // velocity: {
          //   initialRange: [
          //     [-2, -0.5, 0],
          //     [2, -3.5, 0],
          //   ],
          // },
          // velocity: {
          //   initialRange: [
          //     [-0.1, 0.7, 0],
          //     [0.1, 0.95, 0],
          //   ],
          // },
        }}
      />
    </ViroARScene>
  );
};

module.exports = RainCameraView;
