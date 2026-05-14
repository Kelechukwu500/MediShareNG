let audio = null;

export const playRingtone = () => {
  audio = new Audio("/ringtone.mp3");
  audio.loop = true;
  audio.play();
};

export const stopRingtone = () => {
  if (audio) {
    audio.pause();
    audio = null;
  }
};
