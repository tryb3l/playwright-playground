# Playwright Playground

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

An end-to-end testing project using [Playwright](https://playwright.dev/) with an Angular application. This project demonstrates the use of the Page Object Model (POM) and component-based architecture in automated UI testing. The application under test is a modified and lightweight version of the [Ngx-Admin](https://github.com/akveo/ngx-admin) Angular 14 application from [Akveo](https://akveo.com/).

## Table of Contents

- Project Structure
- Concepts and Design Decisions
- Installation
  - Prerequisites
  - Installing the Angular Application
  - Installing Playwright Tests
- Running the Application
- Running Tests
  - Execute Tests
  - Debug Tests
- Continuous Integration
- License

## Project Structure

The repository is organized as follows:

```
.
├── app
│   ├── angular.json
│   ├── package.json
│   ├── src
│   │   └── app
│   |   └── assets
│   │   └── environments
├── e2e
│   ├── lib
│   │   └── components
|   |   |   └── base.component
|   |   |   └── forms
|   |   |   |   └── base
|   |   |   |   |   └── base.form.component
|   |   |   |   └── inline-form.component
|   |   |   |   └── grid-form.component
|   |   |   |   └── **
|   |   |   └── navigation
|   |   |   |   └── navigation.component
|   |   |   └── date-picker
|   |   |   |   └── date-picker.component
|   |   |   └── table
|   |   |       └── **
│   │   └── fixtures
|   |   |   └── base-fixtures
|   |   |   └── start-page.enum
|   |   └── utils
|   |   |   └── **
|   |   └── factories
|   |       └── **
│   ├── pages
│   │   └── page-manager
|   |   └── form-layouts.page
|   |   └── **
│   └── tests
|       └── base
├── .github
│   └── workflows
│       └── playwright.yml
├── playwright.config.ts
├── package.json
└── README.md
```

**app**

Contains the Angular application under test.

- **`src/`**: Source code of the Angular application.

package.json

Dependencies and scripts for the Angular application.

- **`angular.json`**: Configuration file for Angular CLI.

**e2e**

Contains end-to-end tests written using Playwright.

- **`lib/`**: Base components, utils and fixtures for tests.
- **`pages/`**: Page Object Models (POMs) for application pages.
- **`tests/`**: Test suites and test cases.

**workflows**

GitHub Actions workflow files.

**playwright.yml**

Workflow to run Playwright tests on push and pull requests.

**playwright.config.ts**

Configuration file for Playwright.

**package.json**

Dependencies and scripts for Playwright tests.

## Concepts and Design Decisions

### Page Object Model (POM)

The project utilizes the **Page Object Model** pattern to enhance test maintenance and scalability. Each page or component of the application is represented by a class, containing elements and methods that interact with the UI.

- **Benefits**:
  - **Reusability**: Common actions are encapsulated within page objects.
  - **Maintainability**: Changes in the UI require updates only in the corresponding page objects.

### Component-Based Architecture

Components represent reusable parts of the UI, such as forms or navigation elements. This mirrors the component structure of modern frontend frameworks like Angular, allowing tests to interact with UI components in a modular way.

- **Benefits**:
  - **Modularity**: Components can be composed to form complex interactions.
  - **Clarity**: Improved readability by abstracting low-level interactions.

### Overall Architecture

- **Test Fixtures**: Custom fixtures are used to set up and tear down test environments, injecting dependencies like page objects.
- **Selectors and Locators**: Consistent strategies for locating elements, improving reliability and reducing flakiness.
- **Configuration Management**: Centralized configuration for test settings, environment variables, and browser options.

## Installation

### Prerequisites

- **Node.js >= 22**: Ensure you have Node.js version 22 or later installed.
- **Git**: For cloning the repository.

### Installing the Angular Application & Playwright Test dependencies

1. **Open terminal**:

2. **Install all dependencies at once**:

   ```sh
   make install-all
   ```

   This command will install dependencies for the Angular application and Playwright tests. And you can skip next steps: installing playwright tests,

### Installing Playwright Tests

1. **Navigate to the root directory** (if not already there):

   ```sh
   cd ..
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Install Playwright browsers**:

   ```sh
   npx playwright install
   ```

### Installing Angular Application dependencies

1. **Navigate to the /app directory** (if not already there):

   ```sh
   cd app
   ```

2. **Install dependencies**:

   ```sh
   npm install --force
   ```

## Running the Application

**To access the Angular application locally**:

**Execute command in your terminal**
`     make start-app
    `
If for some reason it doesnt work for you, please do next steps listed below:

Open your browser and navigate to `http://localhost:4200`.

1. **Navigate to the app directory**:

   ```sh
   cd app
   ```

2. **Start the development server**:

   ```sh
   npm start
   ```

3. **Access the application**:

   Open your browser and navigate to `http://localhost:4200`.

## Running Tests

### Execute Tests

To run all Playwright end-to-end tests:

**In your terminal execute the command**:

```sh
make run-all
```

Or alternatively you can do next steps:

1. **In a new terminal, navigate to the root directory**:

   ```sh
   cd path/to/project
   ```

2. **Run the tests**:

   ```sh
   npm run test:e2e
   ```

### Debug Tests

To run Playwright tests in debug mode:

```sh
npm run test:e2e:debug
```

This will open a Playwright inspector window, allowing you to step through tests interactively.

## Continuous Integration

The project uses GitHub Actions for continuous integration. Tests are automatically run on push and pull request events for the [`main`](https://github.com/tryb3l/playwright-playground/tree/main 'Go to definition') branch.

**Workflow File**:

[playwright.yml](https://github.com/tryb3l/playwright-playground/blob/main/.github/workflows/playwright.yml)

**Status Badge**:

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

## License

This project is licensed under the MIT License.

---

Feel free to contribute to this project or reach out if you have any questions!

- **Author**: [Bohdan Trybel](https://github.com/tryb3l)
- **Email**: bogdan.trybel@gmail.com
