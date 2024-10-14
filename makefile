build-app:
	@echo "Installing the app"
	@cd app && npm install --force

install-playwright:
	@echo "Installing playwright"
	@npm install
	@echo "Installing playwright browsers"
	@npx playwright install

run-app:
	@echo "Launching the app"
	@cd app && npm run start

install-all:
	@echo "Installing all dependencies"
	@make install-playwright
	@make build-app

run-tests:
	@echo "Running the tests"
	@npm test:e2e