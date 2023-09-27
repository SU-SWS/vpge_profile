#!/bin/bash

# Use find to get all files and directories recursively
# and execute a bash command to rename them
find . -depth -name 'vpge_*' -exec bash -c '
  for item; do
    # Use parameter expansion to remove the path
    base=$(basename "$item")
    # Use parameter expansion to remove 'vpge_' prefix from the item name
    newname="diversityworks_${base#vpge_}"
    # Construct the new path
    newpath=$(dirname "$item")/"$newname"
    # Rename the item
    mv -- "$item" "$newpath"
  done
' bash {} +
