#!/usr/bin/env bash

SOURCE="$1"

: ${SOURCE:=src}

TARGET="$2"

: ${TARGET:=dist}

rsync -rav --exclude="*.ts" $SOURCE/ $TARGET/
