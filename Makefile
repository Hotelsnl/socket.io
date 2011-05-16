build:
	node ./bin/builder.js

test:
	expresso -I lib tests/*.test.js

qunit:
	open tests/index.html

.PHONY: test build