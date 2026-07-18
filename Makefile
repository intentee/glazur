COVERAGE_DIR := coverage
NODE_MODULES := node_modules
SRC_FILES := $(wildcard src/*.mjs)
TEST_GLOB := tests/**/*.test.mjs
TYPES_DIR := types

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)

$(TYPES_DIR): $(SRC_FILES) tsconfig.build.json $(NODE_MODULES)
	npx tsc --project tsconfig.build.json
	touch $(TYPES_DIR)

.PHONY: clean
clean:
	rm -rf $(COVERAGE_DIR) $(TYPES_DIR)

.PHONY: coverage
coverage: $(NODE_MODULES)
	node scripts/check-coverage.mjs '$(TEST_GLOB)'

.PHONY: format
format: $(NODE_MODULES)
	npx prettier --write .

.PHONY: test
test: $(NODE_MODULES)
	timeout 10 node --test --test-timeout=1000 '$(TEST_GLOB)'

.PHONY: type-coverage
type-coverage: $(NODE_MODULES)
	npx type-coverage --at-least 100 --strict --detail

.PHONY: typecheck
typecheck: $(NODE_MODULES)
	npx tsc

.PHONY: visualize
visualize: $(NODE_MODULES)
	node scripts/serve.mjs
