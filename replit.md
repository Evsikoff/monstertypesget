# NestJS Monster Competition History API

## Overview
This is a NestJS backend application that provides API endpoints for monster competition history and impacts. The application connects to a PostgreSQL database and provides endpoints for retrieving monster data.

## Current Status
- ✅ Application successfully set up and running on Replit
- ✅ NestJS server configured to run on port 5000 with 0.0.0.0 host binding
- ✅ CORS enabled for cross-origin requests
- ✅ Database configuration updated to use environment variables
- ✅ TypeScript compilation working correctly
- ✅ Deployment configuration set up for autoscale

## Project Structure
```
src/
├── entities/                           # TypeORM entity definitions
│   ├── competitions-instances-monsters.entity.ts
│   └── users-and-monsters.entity.ts
├── app.controller.ts                   # Main application controller
├── app.module.ts                       # Root module with database config
├── app.service.ts                      # Main application service
├── main.ts                            # Application bootstrap
├── monstertypes.controller.ts          # Monster types controller
├── monstertypes.service.ts            # Monster types service
└── types.ts                           # Type definitions
```

## API Endpoints
- `GET /health` - Health check endpoint (working)
- `GET /monstertypes` - Get all monster types (requires database)
- `POST /monster-impacts` - Get monster impacts by monster ID (requires database)

## Database Configuration
The application is configured to work with PostgreSQL and uses environment variables for secure database connection:
- Uses `DATABASE_URL` environment variable when available
- Falls back to hardcoded Yandex Cloud connection for compatibility
- SSL configuration handled automatically based on environment

## Development
- **Start Development Server**: `npm run start:dev`
- **Build**: `npm run build`
- **Start Production**: `npm run start`

## Deployment
Configured for Replit autoscale deployment with:
- Build step: `npm run build`
- Start command: `npm run start`
- Port: 5000 (automatically configured)

## Notes
- The application expects a PostgreSQL database with tables: `monstertypes`, `impacts`, `monstersextraimpacts`, `monstersimpactshistory`
- Database schema needs to be set up separately
- External API dependency for monster characteristics at: `https://monstercharacteristics-production.up.railway.app/characteristics`

## Recent Changes (Sep 19, 2025)
- Imported from GitHub and configured for Replit environment
- Updated main.ts to bind to 0.0.0.0:5000
- Added environment variable support for database configuration
- Fixed module imports and added missing controllers/services
- Set up build and deployment configuration
- Added health endpoint testing