# CI/CD Quick Reference

## ✅ What's Been Set Up

### GitHub Actions Workflows

1. **Main CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Runs on: Push & Pull Requests
   - Checks: Linting, Building, Testing
   - Workspaces: Backend, Web, Mobile

2. **Docker Validation** (`.github/workflows/docker.yml`)
   - Runs on: Docker file changes
   - Checks: Docker build, docker-compose validation

### NPM Scripts Added

Root `package.json` now includes:

| Command                 | Description          |
| ----------------------- | -------------------- |
| `npm run lint`          | Lint all workspaces  |
| `npm run lint:backend`  | Lint backend only    |
| `npm run lint:web`      | Lint web only        |
| `npm run lint:mobile`   | Lint mobile only     |
| `npm run build`         | Build all workspaces |
| `npm run build:backend` | Build backend only   |
| `npm run build:web`     | Build web only       |
| `npm run test`          | Run all tests        |

## 🚀 Quick Start

### Before Pushing Code

```bash
# 1. Run linting
npm run lint

# 2. Run build
npm run build

# 3. Run tests
npm run test
```

### View CI/CD Status

1. Go to GitHub repository
2. Click "Actions" tab
3. View workflow runs

## 🔧 Troubleshooting

### Fix Linting Errors

```bash
# Backend
cd backend && npm run lint -- --fix

# Web
cd web && npm run lint -- --fix

# Mobile
cd mobile && npm run lint -- --fix
```

### Test Docker Build

```bash
# Build backend image
docker-compose build

# Validate compose config
docker-compose config
```

## 📋 Workflow Triggers

| Branch Pattern | CI Pipeline | Docker Build |
| -------------- | ----------- | ------------ |
| `main`         | ✅          | ✅           |
| `develop`      | ✅          | ✅           |
| `feat/*`       | ✅          | ✅           |
| Pull Requests  | ✅          | ✅           |

## 📝 Next Steps

- [ ] Add code coverage reporting
- [ ] Add deployment workflows
- [ ] Add security scanning
- [ ] Add automated releases
- [ ] Add E2E testing

## 📚 Documentation

- Full guide (Vietnamese): `docs/CI-CD-GUIDE.md`
- Workflow docs (English): `.github/workflows/README.md`
