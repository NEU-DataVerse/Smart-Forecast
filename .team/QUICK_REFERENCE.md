# Git & Environment Quick Reference

## 📋 Essential Commands

### First Time Setup

```bash
# Clone the repository
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# Setup environment
cp .env.example .env
# Edit .env with your actual values

# Install all dependencies
pnpm install

# Build shared package
pnpm run build:shared
```

### Daily Development

```bash
# Check git status
git status

# Start development servers
pnpm run dev:backend   # Terminal 1: Backend (NestJS)
pnpm run dev:web       # Terminal 2: Web (Next.js)
pnpm run dev:mobile    # Terminal 3: Mobile (Expo)

# Build shared package (if changed)
pnpm run build:shared
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

## 🔐 Environment Variables Quick Reference

### Required (Must Set)

```bash
# Authentication
JWT_SECRET=your_strong_secret_here

# External APIs
OWM_API_KEY=your_openweather_key

# Firebase (for notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### Database Defaults (Development)

```bash
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=smart_forecast_db

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

### Frontend URLs

```bash
# Web (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Mobile (Expo)
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🗂️ File Structure

```
Smart-Forecast/
├── .gitignore           # What to ignore in git
├── .gitattributes       # Line ending rules
├── .dockerignore        # What to ignore in Docker
├── .editorconfig        # Editor settings
├── .npmrc               # PNPM configuration
├── .env.example         # Environment template
├── .env                 # Your local env (NOT in git)
│
├── backend/             # NestJS backend
├── web/                 # Next.js web app
├── mobile/              # Expo mobile app
├── shared/              # Shared TypeScript types
│
└── .team/               # Team documentation
    ├── API.md
    ├── PROJECT_CONTEXT.md
    ├── CONTRIBUTING.md
    └── TIMELINE.md
```

## 🚫 What's Ignored by Git

✅ **Ignored (Safe)**

- `node_modules/` - Dependencies
- `dist/`, `build/`, `.next/`, `.expo/` - Build outputs
- `.env`, `.env.local` - Environment files
- `*.log` - Log files
- `.DS_Store`, `Thumbs.db` - OS files
- `.vscode/`, `.idea/` - IDE files
- `coverage/` - Test coverage
- `minio-data/`, `storage/` - Data directories

❌ **Not Ignored (Will be committed)**

- `.env.example` - Environment template
- Source code (`.ts`, `.tsx`, `.js`)
- Configuration files
- Documentation (`.md` files)
- `package.json`, `package-lock.json`

## 🔄 Common Git Workflows

### Start New Feature

```bash
git checkout -b feat/your-feature-name
# Make your changes
git add .
git commit -m "feat: describe your feature"
git push origin feat/your-feature-name
```

### Update from Main

```bash
git checkout main
git pull origin main
git checkout feat/your-feature-name
git merge main
```

### Check What's Changed

```bash
git status                    # See modified files
git diff                      # See line changes
git diff --staged             # See staged changes
```

### Undo Changes

```bash
git checkout -- file.txt      # Discard changes to file
git reset HEAD file.txt       # Unstage file
git reset --hard HEAD         # Discard all changes (careful!)
```

## 📦 PNPM Workspace Commands

### Install Package in Specific Workspace

```bash
pnpm add lodash --filter backend
pnpm add axios --filter web
pnpm add expo-notifications --filter mobile
```

### Run Script in Specific Workspace

```bash
pnpm --filter shared run build
pnpm --filter backend run test
pnpm --filter web run lint
```

### Run Script in All Workspaces

```bash
pnpm -r run build
pnpm -r run test
```

## 🐛 Troubleshooting

### Issue: Changes Not Showing in Git

**Solution:** Check if file is ignored

```bash
git check-ignore -v <filename>
```

### Issue: Line Ending Warnings

**Solution:** Normalize line endings

```bash
git config core.autocrlf input    # Linux/Mac
git config core.autocrlf true     # Windows
```

### Issue: Large Files Rejected

**Solution:** Check file size and consider .gitignore

```bash
du -sh <file>                     # Check file size
```

### Issue: Environment Variables Not Loading

**Solution:**

1. Ensure `.env` file exists
2. Check variable names (no spaces)
3. Restart development server

### Issue: Docker Build Slow

**Solution:** Check `.dockerignore` is working

```bash
docker build --progress=plain .   # See detailed logs
```

## 📚 Resources

### API Keys

- **OpenWeatherMap**: https://openweathermap.org/api
- **Mapbox**: https://account.mapbox.com/
- **Firebase**: https://console.firebase.google.com/

### Documentation

- **Git**: https://git-scm.com/doc
- **Docker**: https://docs.docker.com/
- **PNPM Workspaces**: https://pnpm.io/workspaces
- **EditorConfig**: https://editorconfig.org/

### Project Docs

- See `.team/` folder for:
  - `API.md` - API specification
  - `PROJECT_CONTEXT.md` - Project overview
  - `GIT_CONFIG.md` - Detailed git configuration
  - `CONFIG_CHECKLIST.md` - Setup checklist

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: November 10, 2025  
**Team**: NEU-DataVerse
