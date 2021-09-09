# whispers

A chrome extension that has a small chance to whisper your name very late at night.  [Get it here](https://chrome.google.com/webstore/detail/whispers/cnbiogmmebcodnfckkiipfjmdheklmkk)

## Adding new names

1. Edit `audio/names.py`

1. Record yourself whispering names
```
vim names.py  # add names
./record.py
./process.sh
```
