# Playwright Playground

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

An end-to-end testing project using [Playwright](https://playwright.dev/) with an Angular application. This project demonstrates modern testing techniques, including the **Page Object Model (POM)**, **component-based architecture**, **Dependency Injection (DI)**, and **Functional Programming**. The application under test is a modified and lightweight version of the [Ngx-Admin](https://github.com/akveo/ngx-admin) Angular 14 application from [Akveo](https://akveo.com/).

## Table of Contents

- Project Structure
- Concepts and Design Decisions
  - Best Practices
  - Page Object Model (POM)
  - Component-Based Architecture
  - Dependency Injection (DI)
  - Functional Programming
  - Utilities and Helpers
  - Logging and Error Handling
  - Configuration Management
  - Code Quality
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
├── .github/
│   └── workflows/
│       └── playwright.yml
├── app/
│   ├── angular.json
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
│   │   └── ...
│   ├── LICENSE
│   └── README.md
├── docs/
│   └── e2e/
│       └── REQUIREMENTS.md
├── e2e/
│   ├── global-setup.ts
│   ├── global-teardown.ts
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
│   │   ├── factories/
│   │   │   └── users.ts
│   │   ├── fixtures/
│   │   │   ├── base-fixtures.ts
│   │   │   └── start-page.enum.ts
│   │   ├── utils/
│   │   │   ├── console-errors-tracker.ts
│   │   │   ├── config-helpers.ts
│   │   │   ├── logger.ts
│   │   │   ├── wait-util.ts
│   │   │   └── ...
│   │   └── ...
│   ├── pages/
│   │   ├── page-manager.ts
│   │   ├── form-layouts.page.ts
│   │   └── ...
│   ├── tests/
│   │   ├── base/
│   │   ├── forms/
│   │   └── ...
│   ├── playwright.config.ts
│   ├── LICENSE
│   └── README.md
├── docs/
│   └── e2e/
│       └── REQUIREMENTS.md
├── .env.dev
├── .env.staging
├── package.json
├── tsconfig.json
└── README.md
```

- **`app/`**: Contains the Angular application under test.
  - **`src/`**: Source code of the Angular application.
  - **`package.json`**: Dependencies and scripts for the Angular application.
- **`e2e/`**: Contains end-to-end tests written using Playwright.
  - **`lib/`**: Base components, fixtures, utilities, and factories for tests.
    - **`components/`**: Reusable UI components for testing.
    - **`fixtures/`**: Custom test fixtures and enums.
    - **`utils/`**: Utility functions and helpers.
    - **`factories/`**: Data factories for generating test data.
  - **`pages/`**: Page Object Models (POMs) representing application pages.
  - **`tests/`**: Test suites and test cases.
  - **`global-setup.ts`** and **`global-teardown.ts`**: Scripts to run before and after the test suite.
  - **`playwright.config.ts`**: Configuration file for Playwright.
- **`docs/`**: Documentation and requirements.
  - **`REQUIREMENTS.md`**: Detailed project requirements and expectations.
- **`.github/workflows/`**: GitHub Actions workflow files.
  - **`playwright.yml`**: Workflow to run Playwright tests on pushes and pull requests.
- **`package.json`**: Dependencies and scripts for Playwright tests.
- **`tsconfig.json`**: TypeScript configuration.
- **`.env.*`**: Environment configuration files.
- **`README.md`**: Project documentation.

## Concepts and Design Decisions

### Best Practices

This project adheres to industry-standard best practices to ensure high code quality, maintainability, and scalability:

- **DRY (Don't Repeat Yourself)**: Eliminates code duplication by abstracting reusable components and functions.
- **SOLID Principles**:
  - **Single Responsibility Principle**: Each class or module has a single, well-defined responsibility.
  - **Open/Closed Principle**: Modules are open for extension but closed for modification.
  - **Liskov Substitution Principle**: Subtypes must be substitutable for their base types.
  - **Interface Segregation Principle**: Clients should not be forced to depend on interfaces they do not use.
  - **Dependency Inversion Principle**: Depend on abstractions, not concretions.
- **Object-Oriented Programming (OOP)**: Utilizes classes and objects to model real-world entities, promoting encapsulation and inheritance.
- **Functional Programming (FP)**: Incorporates functional programming concepts for cleaner and more efficient code.
- **Modular Design**: Breaks down the application into smaller, manageable modules.
- **Separation of Concerns**: Separates different aspects of the application logic, such as data handling, UI interaction, and test execution.
- **Clean Code Practices**: Emphasizes readability and simplicity, making the codebase easy to understand and maintain.
- **TypeScript for Static Typing**: Enhances code reliability through static type checking, reducing runtime errors.

### Page Object Model (POM)

The project utilizes the **Page Object Model** pattern to enhance test maintenance and scalability. Each page or component of the application is represented by a class containing elements and methods that interact with the UI.

**Benefits**:

- **Maintainability**: Changes to the UI require updates only in the page object classes.
- **Reusability**: Common actions can be reused across multiple tests.
- **Readability**: Tests are more readable and resemble user interactions.

**Example**:

```typescript
// e2e/pages/form-layouts.page.ts

import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';

class FormLayoutsPage {
  private inlineForm: InlineFormComponent;
  private gridForm: GridFormComponent;

  constructor(
    private page: Page,
    inlineForm?: InlineFormComponent,
    gridForm?: GridFormComponent
  ) {
    // Use provided instances or create new ones
    this.inlineForm = inlineForm || new InlineFormComponent(page);
    this.gridForm = gridForm || new GridFormComponent(page);
  }

  async submitInlineFormWithOptions(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    await this.inlineForm.fillName(name);
    await this.inlineForm.fillEmail(email);
    if (rememberMe) {
      await this.inlineForm.checkRememberMe();
    }
    await this.inlineForm.submit();
  }

  // ...
}

export { FormLayoutsPage };
```

### Component-Based Architecture

Components represent reusable parts of the UI, mirroring frontend frameworks like Angular. This approach promotes reusability and modularity.

**Benefits**:

- **Isolation**: Components can be developed and tested independently.
- **Reusability**: Shared components reduce duplication.
- **Abstraction**: Encapsulates complex interactions within components.

**Example**:

```typescript
// e2e/lib/components/forms/inline-form.component.ts

import { Page } from '@playwright/test';

class InlineFormComponent {
  constructor(private page: Page) {}

  async fillName(name: string) {
    await this.page.fill('input[name="name"]', name);
  }

  async fillEmail(email: string) {
    await this.page.fill('input[name="email"]', email);
  }

  async checkRememberMe() {
    await this.page.check('input[name="rememberMe"]');
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  // ...
}

export { InlineFormComponent };
```

### Dependency Injection (DI)

The project leverages **Dependency Injection (DI)** to promote loose coupling and enhance modularity and testability.

**Benefits**:

- **Modularity**: Components and classes are decoupled, making it easier to modify or replace them without affecting other parts of the system.
- **Testability**: Dependencies can be easily mocked or stubbed during testing, allowing for isolated unit tests.
- **Maintainability**: Reduces interdependencies between components, simplifying maintenance and updates.

**Implementation**:

- **Constructor Injection**: Classes receive their dependencies through their constructors, promoting explicit dependency management.

**Example**:

```typescript
// e2e/pages/form-layouts.page.ts

import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';

class FormLayoutsPage {
  private inlineForm: InlineFormComponent;
  private gridForm: GridFormComponent;

  constructor(
    private page: Page,
    inlineForm?: InlineFormComponent,
    gridForm?: GridFormComponent
  ) {
    this.inlineForm = inlineForm || new InlineFormComponent(page);
    this.gridForm = gridForm || new GridFormComponent(page);
  }

  // ...
}

export { FormLayoutsPage };
```

In this example:

- The `FormLayoutsPage` depends on `InlineFormComponent` and `GridFormComponent`.
- Dependencies are injected via the constructor, allowing for flexibility and easier testing.
- During testing, mock components can be provided to the `FormLayoutsPage` for isolated testing.

### Functional Programming

The project embraces **Functional Programming (FP)** principles to enhance code modularity, readability, and maintainability.

**Key Concepts Used**:

- **Higher-Order Functions**: Functions that take other functions as arguments or return them.
- **Pure Functions**: Functions without side effects that return the same output given the same input.
- **Immutability**: Data is not modified after it's created, promoting predictability.
- **Function Composition**: Building complex functionality by combining simpler functions.

**Implementation Examples**:

1. **Higher-Order Functions in Utilities**

   The `waitForCondition` function in `wait-util.ts` is a prime example.

   ```typescript
   // e2e/lib/utils/wait-util.ts

   export async function waitForCondition(
     conditionFn: () => Promise<boolean>,
     timeout = 5000,
     interval = 100
   ): Promise<void> {
     const startTime = Date.now();
     while (Date.now() - startTime < timeout) {
       if (await conditionFn()) {
         return;
       }
       await new Promise((resolve) => setTimeout(resolve, interval));
     }
     throw new Error('Condition not met within timeout');
   }
   ```

   - **Higher-Order Function**: Accepts `conditionFn` as a parameter.
   - **Asynchronous Control Flow**: Uses promises and async/await.
   - **Immutability**: Variables like `startTime` are not modified after initialization.

2. **Array Operations with Functional Methods**

   ```typescript
   const activeUsers = users
     .filter((user) => user.isActive)
     .map((user) => ({ id: user.id, name: user.name }));
   ```

   - **Pure Functions**: `filter` and `map` callbacks have no side effects.
   - **Immutability**: Original array is not mutated.

3. **Avoiding Side Effects**

   ```typescript
   function calculateTotal(items: number[]): number {
     return items.reduce((sum, item) => sum + item, 0);
   }
   ```

   - Depends solely on input parameters.
   - No external state is modified.

**Benefits**:

- **Modularity**: Functions are self-contained and reusable.
- **Predictability**: Pure functions make code behavior predictable.
- **Testability**: Easier to test functions in isolation.
- **Concurrency**: Immutability reduces issues with shared state.

### Utilities and Helpers

The project includes utility functions and helpers to handle common tasks, enhancing code reuse and maintainability.

- **Custom Test Fixtures**: Extended Playwright test fixtures with additional options and custom initialization.
- **Utility Functions**: Reusable functions like `waitForCondition` for polling conditions.
- **Configuration Helpers**: Functions to create and manage Playwright configurations dynamically.

**Example**:

```typescript
// e2e/lib/utils/wait-util.ts

export async function waitForCondition(
  conditionFn: () => Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await conditionFn()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error('Condition not met within timeout');
}
```

### Logging and Error Handling

Implemented comprehensive logging and error handling to facilitate debugging and improve test reliability.

- **Structured Logging with Pino**: Uses `pino` and `pino-pretty` for structured and human-readable logs.
- **Custom Decorators**: Utilizes decorators like `ActionLogger` and `ErrorHandler` to wrap methods with logging and error handling logic.
- **Console Error Tracking**: Tracks and reports console errors during tests to catch client-side issues.

**Example**:

```typescript
// e2e/lib/utils/logger.ts

import pino from 'pino';

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: true,
    },
  },
});
```

### Configuration Management

Centralized configuration ensures consistency across environments and simplifies management.

- **Centralized Configurations**: All configurations are managed in `playwright.config.ts` and helper functions.
- **Environment Variables**: Uses `.env` files and the `dotenv` package to manage environment-specific settings.
- **Config Helpers**: Functions to generate configurations dynamically based on the environment.

**Example**:

```typescript
// e2e/lib/utils/config-helpers.ts

import { devices, PlaywrightTestConfig } from '@playwright/test';

const createBaseConfig = (isCI: boolean): Partial<PlaywrightTestConfig> => ({
  timeout: 120_000,
  retries: isCI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    // ...
  },
});

export { createBaseConfig };
```

### Code Quality

Maintains high code quality through consistent coding styles and automated linting and formatting tools.

- **TypeScript Strict Mode**: Enables strict mode for better type checking.
- **ESLint with Prettier**: Enforces code style and formatting rules.
- **Path Aliases**: Simplifies imports and enhances readability.

**Configuration**:

```jsonc
// tsconfig.json

{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["e2e/pages/*"],
      "@components/*": ["e2e/lib/components/*"],
      "@utils/*": ["e2e/lib/utils/*"],
      "@fixtures/*": ["e2e/lib/fixtures/*"],
    },
    // ...
  },
  // ...
}
```

## Requirements

For detailed project requirements and expectations, refer to the `REQUIREMENTS.md` file located in the `docs/e2e/` directory. This document outlines the best practices, general requirements, specific requirements, and optional enhancements considered during the development of this project.

**Highlights**:

- **Readability and Maintainability**: Emphasis on clean code, consistent naming conventions, and comprehensive documentation.
- **Project Structure Clarity**: Logical organization and modular design for ease of navigation and scalability.
- **Scalability**: Design choices that support extensibility and adaptability to new requirements.
- **Automated Testing**: Integration with continuous integration pipelines for automated test execution.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js version **22** or higher installed.
- **npm**: Node.js package manager.

### Installing Dependencies

Clone the repository and install the dependencies:

```bash
git clone https://github.com/tryb3l/playwright-playground.git
cd playwright-playground
npm install
```

Install dependencies for the Angular application:

```bash
cd app
npm install
```

## Running the Application

Start the Angular application:

```bash
cd app
npm start
```

The application should now be running at `http://localhost:4200`.

## Running Tests

### Execute Tests

Run the Playwright end-to-end tests:

```bash
npm run test:e2e
```

This command will execute all tests in the `e2e/tests` directory.

### Debug Tests

Run tests in debug mode:

```bash
npm run test:e2e:debug
```

This will open the Playwright Inspector, allowing you to step through tests interactively.

## Continuous Integration

The project is configured to run tests automatically using GitHub Actions. The workflow is defined in `.github/workflows/playwright.yml`.

**Features**:

- **Automated Testing**: Tests run on every push and pull request.
- **CI Environments**: Supports different environments specified in `.env` files.
- **Reporting**: Generates test reports accessible via GitHub Actions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or collaboration, please contact [tryb3l](https://github.com/tryb3l).
