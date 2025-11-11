#!/bin/bash

cd /path/to/your/project

while true
do
  git add .
  git commit -m "Auto-update $(date)"
  git push origin main
  sleep 300  # waits 5 minutes before checking again
done
