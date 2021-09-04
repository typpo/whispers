const name = window.location.search.slice(1);
const url = `https://www.ianww.com/whispers/audio/${name}.wav`;
console.log('playing', url);
const audio = new Audio(url);
audio.addEventListener('canplaythrough', event => {
  audio.play();
});
