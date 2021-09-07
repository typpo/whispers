#!/bin/bash -e

pushd $(dirname $0) &>/dev/null
cd whispers

echo 'Generating noise profile...'
sox michael.wav noise-audio.wav trim 0.6 1.5
sox noise-audio.wav -n noiseprof noise.prof
for f in *.wav; do
  echo "Processing ${f}..."
  sox ${f} audio-clean.wav noisered noise.prof 0.3
  sox audio-clean.wav "edited/${f}" reverb 100 50 100
done

echo 'Done.'

popd &>/dev/null
