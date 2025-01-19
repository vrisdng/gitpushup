#!/bin/bash
python -m venv ./.venv/gitpushup 
if [ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]; then
    # Windows (Git Bash or similar)
    ./.venv/gitpushup/Scripts/activate
else
    source ./.venv/gitpushup/bin/activate
fi

pip install -r requirements.txt
