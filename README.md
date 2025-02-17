# Playwright Playground

[![Playwright Tests](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml/badge.svg)](https://github.com/tryb3l/playwright-playground/actions/workflows/playwright.yml)

An end-to-end testing project using [Playwright](https://playwright.dev/) with an Angular application. This project demonstrates modern testing techniques—combining the Page Object Model (POM), component-based architecture, Dependency Injection (DI), Functional Programming, and lazy initialization of page objects. The application under test is a modified and lightweight version of the [Ngx-Admin](https://github.com/akveo/ngx-admin) Angular 14 application from [Akveo](https://akveo.com/).

---

## Table of Contents

- [Project Structure](#1-project-structure)
- [Concepts and Design Decisions](#2-concepts-and-design-decisions)
  - [Best Practices](#21-best-practices)
  - [Page Object Model (POM)](#22-page-object-model-pom)
  - [Component-Based Architecture](#23-component-based-architecture)
  - [Dependency Injection (DI)](#24-dependency-injection-di)
  - [Functional Programming (FP)](#25-functional-programming-fp)
  - [Lazy Initialization of Page Objects](#26-lazy-initialization-of-page-objects)
  - [Utilities and Helpers](#27-utilities-and-helpers)
  - [Logging and Error Handling](#28-logging-and-error-handling)
  - [Configuration Management](#29-configuration-management)
  - [Code Quality](#210-code-quality)
- [Requirements](#3-requirements)
- [Installation](#4-installation)
  - [Prerequisites](#41-prerequisites)
  - [Installing Dependencies](#42-installing-dependencies)
- [Running the Application](#5-running-the-application)
- [Running Tests](#6-running-tests)
  - [Execute Tests](#61-execute-tests)
  - [Debug Tests](#62-debug-tests)
- [Continuous Integration](#7-continuous-integration)
- [License](#8-license)
- [Contact](#9-contact)

---

## 1. Project Structure

```bash
playwright-playground/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── .vscode/
│   └── settings.json
├── app/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   ├── LICENSE
│   └── README.md
├── docs/
│   └── e2e/
│       └── REQUIREMENTS.md
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
│   │   ├── form-layouts.page.ts
│   │   ├── toastr.page.ts
│   │   └── ...
│   ├── tests/
│   │   ├── base/
│   │   ├── forms/
│   │   ├── toastr.test.ts
│   │   └── ...
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   ├── playwright.config.ts
│   ├── LICENSE
│   └── README.md
├── .env.dev
├── .env.staging
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Concepts and Design Decisions

### 2.1 Best Practices

This project adheres to industry-standard best practices to ensure high code quality, maintainability, and scalability:

- **DRY (Don’t Repeat Yourself)**
  Eliminates code duplication by abstracting reusable components and functions.
- **SOLID Principles**
  - Single Responsibility Principle
  - Open/Closed Principle
  - Liskov Substitution Principle
  - Interface Segregation Principle
  - Dependency Inversion Principle
- **Object-Oriented Programming (OOP)**
  Promotes encapsulation and inheritance.
- **Functional Programming (FP)**
  Encourages pure functions and higher-order functions where appropriate.
- **Modular Design & Separation of Concerns**
  Breaks down large functionalities into more manageable, testable units.
- **Clean Code Practices & Static Typing**
  Readable code with enforced style rules (ESLint, Prettier) and TypeScript for safety.

### 2.2 Page Object Model (POM)

Each page or major feature is encapsulated in a dedicated class, centralizing all selectors and interactions. This also reduces duplication across tests.

Example: form-layouts.page.ts

```typescript
import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';

class FormLayoutsPage {
  private inlineForm: InlineFormComponent;
  private gridForm: GridFormComponent;

  constructor(private page: Page) {
    this.inlineForm = new InlineFormComponent(page);
    this.gridForm = new GridFormComponent(page);
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

  async submitGridFormDetails(/*...*/) {
    // Implementation using GridFormComponent
  }
}

export { FormLayoutsPage };
```

### 2.3 Component-Based Architecture

Inspired by frontend frameworks like Angular, the test code is oriented around reusable components. Each component class interacts with specific UI sections that can appear on multiple pages.

**Example: inline-form.component.ts**

```typescript
import { Page } from '@playwright/test';

export class InlineFormComponent {
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
}
```

### 2.4 Dependency Injection (DI)

Dependencies are provided through constructors or optional injection, making components modular and easily testable. This approach also aligns with Angular’s DI model.

**Example: toastr.page.ts**

```typescript
import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { OptionListComponent } from '@components/list/option-list.component';

export class ToastrPage extends BaseComponent {
  private _positionSelect?: OptionListComponent;

  constructor(page: Page) {
    super(page, 'ToastrPage');
  }

  private get positionSelect(): OptionListComponent {
    if (!this._positionSelect) {
      // Lazy instantiation
      this._positionSelect = new OptionListComponent(
        this.page,
        'nb-select[[(selected)]="position"]'
      );
    }
    return this._positionSelect;
  }

  async selectPosition(position: string) {
    await this.positionSelect.selectOption(position);
  }
}
```

### 2.5 Functional Programming (FP)

Where beneficial, the project uses FP concepts such as higher-order functions and pure utility methods. For example, wait-util.ts uses a higher-order function signature for condition checking, and array operations often rely on immutable transformations like `map`, `filter`, and `reduce`.

```typescript
// e2e/lib/utils/wait-util.ts
export async function waitForCondition(
  conditionFn: () => Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await conditionFn()) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error('Condition not met within timeout');
}
```

### 2.6 Lazy Initialization of Page Objects

Instead of creating all sub-components in the constructor, the project employs lazy initialization. This defers the creation of each component until it’s first needed, leading to cleaner code and better performance if certain components aren’t used.

**Example** (continued from above toastr.page.ts):

```typescript
private get positionSelect(): OptionListComponent {
  if (!this._positionSelect) {
	this._positionSelect = new OptionListComponent(this.page, 'nb-select[[(selected)]="position"]');
  }
  return this._positionSelect;
}
```

### 2.7 Utilities and Helpers

Shared functionality resides in reusable utility modules under utils. Examples include:

- **wait-util.ts**: Polls a condition function until it becomes `true` or times out.
- **config-helpers.ts**: Dynamically manages Playwright configurations.
- **console-errors-tracker.ts**: Captures and logs browser console errors to help identify front-end issues.

### 2.8 Logging and Error Handling

- Uses logger.ts for structured logging, typically via `pino`.
- Tracks console errors with console-errors-tracker.ts.
- Employs decorators (e.g., `ActionLogger`, `ErrorHandler`) around certain critical methods to capture crucial debugging information if something fails.

### 2.9 Configuration Management

- **playwright.config.ts** centralizes all test-related configurations.
- **`.env.*`** files store environment-specific variables.
- The project supports multiple environments (e.g., dev, staging), facilitating integration testing and deployment pipelines.

### 2.10 Code Quality

- **TypeScript Strict Mode**: Enhanced type checking to catch errors early.
- **Linting & Formatting**: ESLint and Prettier ensure consistent style.
- **Path Aliases**: Simplify imports (e.g., `@components/...`, `@pages/...`) for readability.

---

## 3. Requirements

Refer to REQUIREMENTS.md for details on project goals, acceptance criteria, and overall expectations.

Key Requirements:

- Clear architectural design to accommodate new features.
- Demonstrations of advanced testing patterns (lazy initialization, DI, FP).
- Extensive test coverage on critical functionalities (e.g., form submissions, date pickers, toasts).

---

## 4. Installation

### 4.1 Prerequisites

- Node.js v22 or higher
- npm

### 4.2 Installing Dependencies

Clone the repository and install dependencies for both the root and Angular app:

```bash
git clone https://github.com/tryb3l/playwright-playground.git
cd playwright-playground
npm install

cd app
npm install
```

---

## 5. Running the Application

From the app folder:

```bash
npm start
```

The app listens on [http://localhost:4200](http://localhost:4200).

---

## 6. Running Tests

### 6.1 Execute Tests

```bash
npm run test:e2e
```

This runs all Playwright tests found in tests.

### 6.2 Debug Tests

```bash
npm run test:e2e:debug
```

Launches the Playwright Inspector, allowing interactive debugging (step-by-step execution and DOM inspection).

---

## 7. Continuous Integration

GitHub Actions automatically triggers Playwright tests on each push and pull request. Refer to playwright.yml for details:

- **Branch-specific builds** (e.g., dev, main)
- **Environment-based test suites**
- **Failure alerts** via GitHub

---

## 8. License

This project is licensed under the MIT License. Refer to the LICENSE file for details.

---

## 9. Contact

This test automation project is maintained by [tryb3l](https://github.com/tryb3l). For any inquiries, suggestions, or potential collaboration, feel free to reach out via GitHub issues.
