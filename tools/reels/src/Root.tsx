import React from 'react';
import {Composition} from 'remotion';
import {Reel0, REEL0_FRAMES} from './Reel0';
import {DayReel, dayFrames} from './DayReel';
import {EnergyReel, energyFrames} from './EnergyReel';
import {Reel0Energy, energy0Frames} from './Reel0Energy';
import {VoiceReel, voiceFrames} from './VoiceReel';
import {W, H} from './brand';

export const Root: React.FC = () => (
  <>
    <Composition id="Voice01" component={VoiceReel} defaultProps={{day: 1}} durationInFrames={voiceFrames(1)} fps={30} width={W} height={H} />
    <Composition id="Voice02" component={VoiceReel} defaultProps={{day: 2}} durationInFrames={voiceFrames(2)} fps={30} width={W} height={H} />
    <Composition id="Energy00" component={Reel0Energy} durationInFrames={energy0Frames()} fps={30} width={W} height={H} />
    <Composition id="Reel0" component={Reel0} durationInFrames={REEL0_FRAMES} fps={30} width={W} height={H} />
    {Array.from({length: 30}, (_, i) => i + 1).map((n) => (
      <Composition key={n} id={`Day${String(n).padStart(2, '0')}`} component={DayReel} defaultProps={{day: n}}
        durationInFrames={dayFrames(n)} fps={30} width={W} height={H} />
    ))}
    {Array.from({length: 30}, (_, i) => i + 1).map((n) => (
      <Composition key={'e' + n} id={`Energy${String(n).padStart(2, '0')}`} component={EnergyReel} defaultProps={{day: n}}
        durationInFrames={energyFrames(n)} fps={30} width={W} height={H} />
    ))}
  </>
);
