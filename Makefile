.PHONY: watchify debugserver

debugserver:
	node_modules/.bin/static -p 4444 test

watchify:
	node_modules/.bin/watchify test/debug.jsx -v -t [ reactify --es6  ] -t es6ify -o test/debug.js --debug

build:
	rm -f dist/*.js
	node_modules/.bin/babel -d dist/ src/
