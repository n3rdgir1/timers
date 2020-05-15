import React, { useState } from 'react';
import Sound from 'react-sound';
import './Alarm.scss';

export default () => {
  const [playing, setPlaying] = useState(Sound.status.PLAYING);

  return (
    <>
      <Sound
        url="alarm.wav"
        playStatus={playing}
        playFromPosition={0}
      />
      <button
        type="button"
        onClick={() => setPlaying(Sound.status.STOPPED)}
        className="mute"
      >
        Mute Alarm
      </button>
    </>
  );
};
