import React from 'react';
import {Composition, Still} from 'remotion';
import {ReelCover} from './ReelCover';
import {FbCover, FB_W, FB_H} from './FbCover';
import {YtBanner, YT_W, YT_H} from './YtBanner';
import {FollowCardDemo} from './FollowCard';
import {Highlight, HIGHLIGHTS} from './Highlight';
import {HighlightCard} from './HighlightCard';
import {Reel0, REEL0_FRAMES} from './Reel0';
import {DayReel, dayFrames} from './DayReel';
import {EnergyReel, energyFrames} from './EnergyReel';
import {Reel0Energy, energy0Frames} from './Reel0Energy';
import {VoiceReel, voiceFrames} from './VoiceReel';
import {W, H} from './brand';

export const Root: React.FC = () => (
  <>
    {HIGHLIGHTS.map((h) => <Still key={h.id} id={`HL-${h.id}`} component={Highlight} defaultProps={{id: h.id}} width={1080} height={1080} />)}
    {HIGHLIGHTS.map((h) => <Still key={'l' + h.id} id={`HL-${h.id}-light`} component={Highlight} defaultProps={{id: h.id, light: true}} width={1080} height={1080} />)}
    {HIGHLIGHTS.map((h) => <Still key={'c' + h.id} id={`HLCard-${h.id}`} component={HighlightCard} defaultProps={{id: h.id}} width={1080} height={1920} />)}
    <Composition id="FollowCardDemo" component={FollowCardDemo} durationInFrames={150} fps={30} width={W} height={H} />
    <Still id="YtBanner" component={YtBanner} width={YT_W} height={YT_H} />
    <Still id="YtBannerGuide" component={YtBanner} defaultProps={{guide: true}} width={YT_W} height={YT_H} />
    <Still id="FbCover" component={FbCover} width={FB_W} height={FB_H} />
    <Still id="Cover02" component={ReelCover} defaultProps={{day: 2}} width={W} height={H} />
    <Still id="Cover03" component={ReelCover} defaultProps={{day: 3}} width={W} height={H} />
    <Still id="Cover04" component={ReelCover} defaultProps={{day: 4}} width={W} height={H} />
    <Still id="Cover05" component={ReelCover} defaultProps={{day: 5}} width={W} height={H} />
    <Composition id="Voice01" component={VoiceReel} defaultProps={{day: 1}} durationInFrames={voiceFrames(1)} fps={30} width={W} height={H} />
    <Composition id="Voice02" component={VoiceReel} defaultProps={{day: 2}} durationInFrames={voiceFrames(2)} fps={30} width={W} height={H} />
    <Composition id="Voice02Short" component={VoiceReel} defaultProps={{day: 2, variant: 's'}} durationInFrames={voiceFrames(2, 's')} fps={30} width={W} height={H} />
    <Composition id="Voice03" component={VoiceReel} defaultProps={{day: 3}} durationInFrames={voiceFrames(3)} fps={30} width={W} height={H} />
    <Composition id="Voice03Short" component={VoiceReel} defaultProps={{day: 3, variant: 's'}} durationInFrames={voiceFrames(3, 's')} fps={30} width={W} height={H} />
    <Composition id="Voice04" component={VoiceReel} defaultProps={{day: 4}} durationInFrames={voiceFrames(4)} fps={30} width={W} height={H} />
    <Composition id="Voice04Short" component={VoiceReel} defaultProps={{day: 4, variant: 's'}} durationInFrames={voiceFrames(4, 's')} fps={30} width={W} height={H} />
    <Composition id="Voice05" component={VoiceReel} defaultProps={{day: 5}} durationInFrames={voiceFrames(5)} fps={30} width={W} height={H} />
    <Composition id="Voice05Short" component={VoiceReel} defaultProps={{day: 5, variant: 's'}} durationInFrames={voiceFrames(5, 's')} fps={30} width={W} height={H} />
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
