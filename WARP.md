# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

The Alsten1 project is a **Service Order Management System** for equipment maintenance and repair services. It's a full-stack application built with a React frontend and Node.js backend, integrated with MySQL/MariaDB database and the Bling ERP system.

## Architecture

### Frontend (React)
- **Location**: `FrontEnd/`
- **Technology**: React 18 with Create React App
- **Key Features**:
  - Role-based authentication (Admin, Técnico, Cliente)
  - Service order management with different user interfaces
  - Bling ERP integration for customer data
  - Bootstrap and React Bootstrap for styling
  - File upload functionality with multer
  - Form validation using Formik and Yup

### Backend (Node.js)
- **Location**: `BackEnd/`
- **Technology**: Node.js with Express (ES modules)
- **Architecture Pattern**: Router-based with service layer
- **Key Features**:
  - JWT authentication with express-session
  - RESTful API with protected routes
  - MySQL connection pooling
  - File upload handling
  - CORS configured for specific origins
  - Role-based access control

### Database
- **Engine**: MySQL/MariaDB
- **Schema**: Comprehensive service order management
- **Key Tables**: 
  - Users with role-based access
  - Service orders with complete lifecycle
  - Equipment models, manufacturers, defects
  - Payment methods, urgency levels, transport types
  - Detailed logging system

## Development Commands

### Backend Development
```bash
# Navigate to backend directory
cd BackEnd

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production mode
npm start

# Test database connection
node testarConexao.js
```

### Frontend Development
```bash
# Navigate to frontend directory
cd FrontEnd

# Install dependencies
npm install

# Start development server (default: http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Management
```bash
# From BackEnd directory
# Initialize complete database schema
mysql -u root -p < criar_banco_completo.sql

# Initialize minimal schema (no sample data)
mysql -u root -p < criar_banco_limpo.sql

# Create log table
node create_log_table.js
```

### Running Tests
```bash
# Test backend database connection
cd BackEnd && node testarConexao.js

# Test CORS configuration
cd BackEnd && node cors-test-server.js

# Run React test suite
cd FrontEnd && npm test
```

## Development Environment Setup

### Required Environment Variables

**Backend (.env)**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_SENHA=your_password
DB_NOME=alsten_os
NODE_ENV=development
PORT=4000
CHAVE_SECRETA=your_secret_key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Database Setup
The system expects a MySQL/MariaDB instance with:
- Database: `alsten_os`
- User with full privileges
- Tables created from `criar_banco_completo.sql`

## Key Application Flows

### Authentication System
- Multi-role system (Admin=1, Diretoria=2, PCM=3, Comercial=4, Logística=5, Técnico=6)
- JWT tokens with express-session
- Role-based route protection
- Bling ERP integration for customer authentication

### Service Order Workflow
1. **Creation**: Equipment details, customer info, urgency level
2. **Processing**: Technical analysis, service assignment
3. **Completion**: Service documentation, payment processing
4. **Logging**: Complete audit trail of all changes

### File Management
- Upload directory: `uploads/`
- Supported formats: Images, documents
- Automatic file naming with timestamps
- Static file serving via Express

## Deployment

### Local Development
Both frontend and backend run simultaneously:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

### Production Deployment
The project supports multiple deployment methods:

1. **Coolify (Recommended)**: Automated deployments with monitoring
2. **Manual PM2**: Process management with ecosystem.config.js
3. **VPS Direct**: Using the provided deployment scripts

See `DEPLOY-VPS.md` and `coolify-config.md` for detailed deployment instructions.

## Code Organization

### Backend Structure
- **Routers/**: API endpoint definitions
- **Service/**: Database connection and business logic
- **Security/**: Authentication middleware
- **DB/**: Database utilities and test queries

### Frontend Structure
- **Components/**: Reusable UI components
- **Services/**: API client services
- **Telas/**: Page components (screens)
- **Context**: User authentication context

### Key Files
- `BackEnd/index.js`: Main server entry point with middleware setup
- `BackEnd/database.js`: Database abstraction layer
- `FrontEnd/src/App.js`: Main application component with routing
- `ecosystem.config.js`: PM2 process configuration

## Integration Points

### Bling ERP
- Customer data synchronization
- Contact management
- OAuth-based authentication
- API endpoints: `/bling/*` routes

### File Handling
- Upload endpoint: `/upload`
- Static serving: `/uploads`
- Automatic file processing and validation

## Common Development Tasks

### Adding New Service Order Types
1. Update database schema in SQL files
2. Create new router in `BackEnd/Routers/`
3. Add corresponding service in `FrontEnd/src/Services/`
4. Create UI components in `FrontEnd/src/Components/`

### Modifying User Roles
1. Update `roles` table in database
2. Modify role checks in authentication middleware
3. Update frontend role-based routing in `App.js`

### Database Schema Changes
1. Modify SQL files in `BackEnd/`
2. Update database abstraction in `database.js`
3. Test with `testarConexao.js`
4. Update API endpoints as needed

## Security Considerations

- Environment variables for sensitive data
- CORS configured for specific origins only
- JWT tokens with expiration
- SQL injection protection with parameterized queries
- File upload restrictions and validation
- Role-based access control throughout the application

## Monitoring and Debugging

### Development
- Backend logs via console and file system
- React DevTools for frontend debugging
- Database query logging available
- CORS debugging tools included

### Production
- PM2 process monitoring
- Log aggregation in `BackEnd/logs/`
- Health check endpoint: `/health`
- Database connection testing utilities