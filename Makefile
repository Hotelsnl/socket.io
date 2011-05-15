build:
	./bin/build

test:
	expresso -I lib tests/*.test.js

.PHONY: test build