# Playwright Playground

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

An end-to-end testing project using [Playwright](https://playwright.dev/) with an Angular application. This project demonstrates the use of the **Page Object Model (POM)** and component-based architecture in automated UI testing. The application under test is a modified and lightweight version of the [Ngx-Admin](https://github.com/akveo/ngx-admin) Angular 14 application from [Akveo](https://akveo.com/).

## Table of Contents

- Project Structure
- Concepts and Design Decisions
  - Best Practices
  - Page Object Model (POM)
  - Component-Based Architecture
  - Overall Architecture
- Requirements
- Installation
  - Prerequisites
  - Installing Dependencies
- Running the Application
- Running Tests
  - Execute Tests
  - Debug Tests
- Continuous Integration
- License
- Contact

## Project Structure

The repository is organized as follows:

```
playwright-playground/
├── app/
│   ├── angular.json
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
│   │   └── ...
│   ├── ...
│   └── README.md
├── e2e/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── base/
│   │   │   │   └── base.component.ts
│   │   │   ├── forms/
│   │   │   │   ├── base/
│   │   │   │   │   └── base.form.component.ts
│   │   │   │   ├── inline-form.component.ts
│   │   │   │   ├── grid-form.component.ts
│   │   │   │   └── ...
│   │   │   ├── navigation/
│   │   │   │   └── navigation.component.ts
│   │   │   ├── date-picker/
│   │   │   │   └── date-picker.component.ts
│   │   │   └── table/
│   │   │       └── ...
│   │   ├── fixtures/
│   │   │   ├── base-fixtures.ts
│   │   │   └── start-page.enum.ts
│   │   ├── utils/
│   │   │   └── ...
│   │   └── factories/
│   │       └── ...
│   ├── pages/
│   │   ├── page-manager.ts
│   │   ├── form-layouts.page.ts
│   │   └── ...
│   ├── tests/
│   │   ├── base/
│   │   ├── forms/
│   │   └── ...
│   ├── playwright.config.ts
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   └── ...
├── docs/
│   └── e2e/
│       └── REQUIREMENTS.md
├── .github/
│   └── workflows/
│       └── playwright.yml
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

- **`app/`**: Contains the Angular application under test.
  - **`src/`**: Source code of the Angular application.
  - **`angular.json`**: Configuration file for Angular CLI.
  - **`package.json`**: Dependencies and scripts for the Angular application.
- **`e2e/`**: Contains end-to-end tests written using Playwright.
  - **`lib/`**: Base components, fixtures, utilities, and factories for tests.
    - **`components/`**: Reusable UI components for testing.
    - **`fixtures/`**: Custom test fixtures and enums.
    - **`utils/`**: Utility functions and helpers.
    - **`factories/`**: Data factories for generating test data.
  - **`pages/`**: Page Object Models (POMs) representing application pages.
  - **`tests/`**: Test suites and test cases.
  - **`playwright.config.ts`**: Configuration file for Playwright.
  - **`global-setup.ts`** and **`global-teardown.ts`**: Scripts to run before and after the test suite.
- **`docs/e2e/REQUIREMENTS.md`**: Detailed project requirements and expectations.
- **`.github/workflows/`**: GitHub Actions workflow files.
  - **`playwright.yml`**: Workflow to run Playwright tests on push and pull requests.
- **`package.json`**: Dependencies and scripts for Playwright tests.
- **`tsconfig.json`**: TypeScript configuration.
- **`README.md`**: Project documentation.

## Concepts and Design Decisions

### Best Practices

The project is built with best programming practices in mind to ensure high code quality, maintainability, and scalability. Key principles include:

- **DRY (Don't Repeat Yourself)**: Avoids code duplication by abstracting reusable components and functions.
- **SOLID Principles**:
  - **Single Responsibility Principle**: Each class or module has a single, well-defined responsibility.
  - **Open/Closed Principle**: Modules are open for extension but closed for modification.
  - **Liskov Substitution Principle**: Objects of a superclass can be replaced with objects of subclasses without affecting correctness.
  - **Interface Segregation Principle**: Many client-specific interfaces are better than one general-purpose interface.
  - **Dependency Inversion Principle**: Depend on abstractions, not concretions.
- **Object-Oriented Programming (OOP)**: Utilizes classes and objects to model real-world entities, promoting encapsulation and inheritance.
- **Modular Design**: Breaks down the application into smaller, manageable modules.
- **Separation of Concerns**: Separates different aspects of the application logic, such as data handling, UI interaction, and test execution.
- **Clean Code Practices**: Emphasizes readability and simplicity, making the codebase easy to understand and maintain.
- **TypeScript for Static Typing**: Enhances code reliability through static type checking, reducing runtime errors.

### Page Object Model (POM)

The project utilizes the **Page Object Model** pattern to enhance test maintenance and scalability. Each page or component of the application is represented by a class containing elements and methods that interact with the UI.

**Benefits**:

- **Reusability**: Common actions are encapsulated within page objects.
- **Maintainability**: Changes in the UI require updates only in the corresponding page objects.
- **Readability**: Tests are easier to read and understand.
- **Abstraction**: Hides the complexity of UI interactions behind simple method calls.

### Component-Based Architecture

Components represent reusable parts of the UI, such as forms or navigation elements. This mirrors the component structure of modern frontend frameworks like Angular, allowing tests to interact with UI components in a modular way.

**Benefits**:

- **Modularity**: Components can be composed to form complex interactions.
- **Clarity**: Improved readability by abstracting low-level interactions.
- **Test Isolation**: Components can be tested independently.
- **Scalability**: Eases the addition of new features without impacting existing components.

### Overall Architecture

- **Test Fixtures**: Custom fixtures are used to set up and tear down test environments, injecting dependencies like page objects and test data.
- **Selectors and Locators**: Consistent strategies for locating elements, improving reliability and reducing flakiness.
- **Configuration Management**: Centralized configuration for test settings, environment variables, and browser options, allowing for easy switching between environments (development, staging).
- **Data-Driven Testing**: Utilizes factories to generate test data dynamically, allowing for thorough testing with various data sets.
- **Continuous Integration (CI)**: Integrates with GitHub Actions for automated testing on pushes and pull requests, ensuring code integrity.
- **Logging and Reporting**: Implements detailed logs and reports for test executions, facilitating debugging and performance tracking.
- **Error Handling**: Robust error handling mechanisms to gracefully manage exceptions and unexpected behaviors.

## Requirements

For detailed project requirements and expectations, refer to the REQUIREMENTS.md file located in the `docs/e2e/` directory. This document outlines the best practices, general requirements, specific requirements, and optional enhancements considered during the development of this project.

**Highlights from REQUIREMENTS.md**:

- **Readability and Maintainability**: Emphasis on clean code, consistent naming conventions, and comprehensive documentation.
- **Project Structure Clarity**: Logical organization and modular design for ease of navigation and scalability.
- **Scalability**: Design choices that support extensibility and adaptability to new requirements.
- **CI/CD Support**: Integration with GitHub Actions for continuous integration and automated testing.
- **Logging and Reporting**: Implementation of comprehensive logging and detailed test reports.
- **Use of Latest Technologies**: Utilization of the latest stable versions of Node.js, TypeScript, and Playwright features.
- **Fixtures and Environment Setup**: Efficient setup and teardown of test environments using Playwright fixtures and environment configurations.
- **Web Server Management**: Automated server launch and readiness checks within the testing framework.

For a complete list of requirements and detailed explanations, view the REQUIREMENTS.md.

## Installation

### Prerequisites

- **Node.js >= 22**: Ensure you have Node.js version 22.11.0 or later installed. It's crucial to install the latest [Node.js](https://nodejs.org/en/) because projects relay on some of the latest node features such as [node-runner](https://nodejs.org/docs/v22.11.0/api/cli.html#--run) to run scripts.
- **Git**: For cloning the repository [download](https://git-scm.com).

### Installing Dependencies

Clone the repository, open your terminal, and run the following commands to install all dependencies at once:

```sh
git clone https://github.com/tryb3l/playwright-playground.git
cd playwright-playground
make install-all
```

This command will utilize the [make](<https://https://en.wikipedia.org/wiki/Make_(software)>) utility to install dependencies for both the Angular application and the Playwright tests. If you prefer manual installation, follow the steps below.

#### Installing Angular Application Dependencies

```sh

cd app

npm install --force

```

#### Installing Playwright Test Dependencies

```sh
cd ..
npm install
npx playwright install --with-deps
```

## Running the Application

To start the Angular application locally:

```sh
make start-app
```

Alternatively, you can start the application manually:

```sh
cd app
npm start
```

Open your browser and navigate to `http://localhost:4200`.

## Running Tests

### Execute Tests

To run all Playwright end-to-end tests:

```sh
make run-all
```

Alternatively, run the tests manually:

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

The project uses **GitHub Actions** for continuous integration. Tests are automatically run on push and pull request events for the `main` branch.

**Workflow File**: `.github/workflows/playwright.yml`

**Status Badge**:

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

## License

This project is licensed under the **MIT License**.

## Contact

- **Author**: [Bohdan Trybel](https://github.com/tryb3l)
- **Email**: bogdan.trybel@gmail.com
