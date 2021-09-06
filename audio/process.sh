#!/bin/bash -e

pushd $(dirname $0) &>/dev/null
cd whispers

for f in *.wav; do
  sox ${f} "edited/${f}" reverb 100 50 100
done

popd &>/dev/null
