#!/usr/bin/env bash

SOURCE=$1

if [ -z "$SOURCE" ]
then
  SOURCE="src/"
fi

# length of "src/" = 4
TARGET="${SOURCE:4}"

TARGET="dist/$TARGET"

rsync -rav --exclude="*.ts" $SOURCE $TARGET
