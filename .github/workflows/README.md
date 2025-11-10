# CI/CD Documentation

## Overview

This project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The workflows automatically run linting, testing, and building processes when code is pushed.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**

-   Push to `main`, `develop`, or any `feat/*` branch
-   Pull requests to `main` or `develop` branches

**Jobs:**

-   **Lint and Build**: Runs linting and build checks for all workspaces
    -   Backend (NestJS)
        -   ESLint
        -   Build
        -   Unit tests
    -   Web (Next.js)
        -   ESLint
        -   Build
    -   Mobile (Expo)
        -   ESLint

**Node Version:** 20.x

### 2. Docker Build (`docker.yml`)

**Triggers:**

-   Push to `main`, `develop`, or any `feat/*` branch (when Docker-related files change)
-   Pull requests to `main` or `develop` branches (when Docker-related files change)

**Jobs:**

-   **Docker Build Validation**: Validates Docker configuration
    -   Builds backend Docker image
    -   Validates docker-compose.yml configuration

## Local Development

### Run All Linting

```bash
npm run lint
```

### Run Individual Workspace Linting

```bash
npm run lint:backend
npm run lint:web
npm run lint:mobile
```

### Run All Builds

```bash
npm run build
```

### Run Individual Workspace Builds

```bash
npm run build:backend
npm run build:web
```

### Run Tests

```bash
npm run test
```

## Workflow Status

You can view the status of workflows in the "Actions" tab of the GitHub repository.

## Troubleshooting

### Linting Errors

If linting fails in CI, run locally to see the errors:

```bash
npm run lint
```

Fix errors automatically where possible:

```bash
npm run lint:backend -- --fix
npm run lint:web -- --fix
```

### Build Errors

If build fails in CI, run locally:

```bash
npm run build
```

Check specific workspace build:

```bash
npm run build:backend
npm run build:web
```

### Docker Build Errors

Test Docker build locally:

```bash
docker-compose build
docker-compose config
```

## Adding New Workflows

To add new workflows, create a new `.yml` file in `.github/workflows/` directory following the same pattern as existing workflows.
