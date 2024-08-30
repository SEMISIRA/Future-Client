#!/usr/bin/env bash

# --delete-dir-on-start breaks nodemon
swc src -d dist --strip-leading-paths $@
