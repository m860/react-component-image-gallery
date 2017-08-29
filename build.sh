./node_modules/.bin/babel --presets=es2015,stage-0,react ./src/components -d ./components
./node_modules/node-sass/bin/node-sass ./src/sass/ -o ./css/
documentation build ./src/components/ -f=md -g=true -o=./API.md