# Variables
APP_DIR := app
NODE_MODULES := node_modules

# Commands
NPM := npm
NPX := npx
PLAYWRIGHT := $(NPX) playwright

build-app:
	@echo "Installing the app"
	@sudo cd $(APP_DIR) && $(NPM) install --force

install-playwright:
	@echo "Installing playwright"
	@$(NPM) install
	@echo "Installing playwright browsers"
	@$(PLAYWRIGHT) install

run-app:
	@echo "Launching the app"
	@cd $(APP_DIR) && $(NPM) run start

install-all:
	@echo "Installing all dependencies"
	@$(MAKE) install-playwright
	@$(MAKE) build-app

run-tests:
	@echo "Running the tests"
	@$(NPM) run test:e2e

# Add target to run tests in debug mode
run-tests-debug:
	@echo "Running the tests in debug mode"
	@$(NPM) run test:e2e:debug

# Add target to run tests in a specific browser (e.g., chromium)
run-tests-chromium:
	@echo "Running tests in chromium"
	@$(PLAYWRIGHT) test --browser chromium

# Add target to generate test report
generate-report:
	@echo "Generating test report"
	@$(PLAYWRIGHT) show-report