import React from 'react';
import {Composition} from 'remotion';
import {Reel0, REEL0_FRAMES} from './Reel0';
import {DayReel, dayFrames} from './DayReel';
import {W, H} from './brand';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel0" component={Reel0} durationInFrames={REEL0_FRAMES} fps={30} width={W} height={H} />
    {Array.from({length: 30}, (_, i) => i + 1).map((n) => (
      <Composition key={n} id={`Day${String(n).padStart(2, '0')}`} component={DayReel} defaultProps={{day: n}}
        durationInFrames={dayFrames(n)} fps={30} width={W} height={H} />
    ))}
  </>
);
