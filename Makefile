build:
	node ./bin/builder

test:
	expresso -I lib tests/*.test.js

qunit:
	node ./tests/qunit.server.js

.PHONY: test build