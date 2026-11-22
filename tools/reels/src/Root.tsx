import React from 'react';
import {Composition} from 'remotion';
import {Reel0, REEL0_FRAMES} from './Reel0';
import {W, H} from './brand';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel0" component={Reel0} durationInFrames={REEL0_FRAMES} fps={30} width={W} height={H} />
  </>
);
