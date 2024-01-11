inotifywait -rm -e CLOSE_WRITE --format "%w" src | stdbuf -o0 sed 's@/$@@' | xargs -n1 -I{} ./script/copy.sh {}
