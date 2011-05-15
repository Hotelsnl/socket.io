build:
	node ./bin/builder.js

test:
	expresso -I lib tests/*.test.js

.PHONY: test build