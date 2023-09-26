#!/bin/bash

# Loop over all items (files or directories) with prefix 'vpge_'
for item in vpge_*; do
  # Check if item exists
  if [[ -e $item ]]; then
    # Use parameter expansion to remove 'vpge_' prefix from the item name
    newname="diversityworks_${item#vpge_}"
    # Rename the item
    mv -- "$item" "$newname"
  fi
done
