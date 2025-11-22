# 📦 StockMaster - Inventory Management System

### 🎯 Team CodeStorm Presents

![StockMaster](https://img.shields.io/badge/StockMaster-Inventory%20Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, full-featured **inventory management system** built for the **Odoo x SPIT Hackathon 25**. StockMaster features a stunning **Neubrutalism design** with bold borders, hard shadows, and vibrant colors, combined with powerful backend APIs for complete inventory control.

### 🔗 Live Demo
**[https://stock-master-odoo.vercel.app](https://stock-master-odoo.vercel.app)**

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [Design System](#-design-system)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎥 Demo Video

**Watch the complete walkthrough:** [StockMaster Demo Video](https://www.loom.com/share/88390e72034b42afa7f307894ea6add6)

## 🌐 Live Demo

**Try it now:** [https://stock-master-odoo.vercel.app/](https://stock-master-odoo.vercel.app/)

## ✨ Features

### 🎨 Neubrutalism Design System
- **Bold 3px borders** throughout the UI for strong visual hierarchy
- **Hard box shadows** (4px-8px offset) for depth and dimension
- **Vibrant color palette** with high contrast combinations
- **No subtle gradients** - only bold, flat colors
- **Brutalist typography** with uppercase headings and bold weights
- **Micro-interactions** with smooth hover effects and transitions
- **Responsive design** optimized for all screen sizes

### 📊 Core Functionality

#### Dashboard
- 📈 Real-time statistics cards (Total Products, Low Stock, Categories, Suppliers)
- 📊 Interactive charts with Recharts:
  - Bar charts for product values by category
  - Pie charts for category distribution
  - Line charts for stock movement trends
- 🚨 Low stock alerts with severity indicators
- 📅 Recent stock movement history

#### Product Management
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- 🔍 Search and filter products by name, category, or SKU
- 📦 Track stock quantities and reorder levels
- 💰 Price management with cost and selling price
- 📷 Product images support
- 🏷️ Category and supplier associations
- ⚠️ Automatic low stock detection

#### Categories
- 🎨 Color-coded category system
- 📝 Category descriptions and metadata
- 🔢 Product count per category
- 🎯 Quick category filtering

#### Suppliers
- 👥 Comprehensive supplier database
- 📧 Contact information (email, phone)
- 📍 Address management
- 🔗 Linked products tracking
- 📊 Supplier performance metrics

#### Stock Movement
- 📥 Track **Stock In** (purchases, returns)
- 📤 Track **Stock Out** (sales, transfers)
- ⚙️ **Stock Adjustments** for corrections
- 📝 Detailed notes and references
- 🕐 Complete audit trail with timestamps
- 📈 Movement history and analytics

#### Reports & Analytics
- 📊 Visual data representation with charts
- 📈 Inventory value calculations
- 🏆 Top products by value
- 📉 Stock level trends
- 💹 Category-wise distribution
- 📅 Date range filtering

### 🔐 Authentication & Security
- ✅ Secure user authentication with **Supabase Auth**
- 🔑 Email/password login
- 📝 User registration with email verification
- 🔒 Protected routes with authentication guards
- 👤 User profile management
- 🔄 Password reset functionality
- 🛡️ Row-Level Security (RLS) policies
- 🔐 JWT-based API authentication

### 🚀 Performance Features
- ⚡ Lightning-fast **Vite** development server
- 🎯 Code splitting and lazy loading
- 📦 Optimized production builds
- 🔄 Efficient state management
- 💾 Smart caching strategies
- 🌐 CDN-ready static assets

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library with hooks and context |
| **Vite** | 7.2.4 | Build tool and dev server |
| **React Router DOM** | 7.9.6 | Client-side routing |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS framework |
| **Recharts** | 3.4.1 | Data visualization charts |
| **Lucide React** | 0.554.0 | Modern icon library |
| **date-fns** | 4.1.0 | Date formatting and manipulation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.18.2 | Web application framework |
| **Supabase JS** | 2.26.0 | Database client and auth |
| **Zod** | 3.22.2 | Schema validation |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.1.4 | Environment variable management |

### Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database platform |
| **PostgreSQL** | Relational database |
| **Row-Level Security** | Fine-grained access control |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **Jest** | Unit testing framework |
| **Supertest** | API testing |
| **Nodemon** | Auto-restart development server |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React Application (Vite + React 19)              │    │
│  │  - Components (UI, Layout, Forms)                  │    │
│  │  - Pages (Dashboard, Products, etc.)               │    │
│  │  - Context (Auth, State Management)                │    │
│  │  - Routing (React Router DOM)                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕️ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                       SERVER SIDE                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Express.js Backend (Node.js)                      │    │
│  │  - REST API Routes                                 │    │
│  │  - Authentication Middleware                       │    │
│  │  - Request Validation (Zod)                        │    │
│  │  - Business Logic                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕️ Supabase Client
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Supabase (PostgreSQL)                             │    │
│  │  - Tables (Products, Categories, etc.)             │    │
│  │  - Row-Level Security (RLS)                        │    │
│  │  - Authentication (Supabase Auth)                  │    │
│  │  - Real-time Subscriptions                         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │  categories  │       │  suppliers   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ name         │       │ name         │
│ full_name    │       │ description  │       │ contact_email│
│ avatar_url   │       │ color        │       │ contact_phone│
│ user_id (FK) │       │ user_id (FK) │       │ address      │
└──────────────┘       └──────────────┘       │ user_id (FK) │
                              │               └──────────────┘
                              │                      │
                              ↓                      ↓
                       ┌──────────────┐
                       │   products   │
                       ├──────────────┤
                       │ id (PK)      │
                       │ name         │
                       │ sku          │
                       │ description  │
                       │ category_id  │←──────┘
                       │ supplier_id  │←──────────────┘
                       │ quantity     │
                       │ reorder_level│
                       │ unit_price   │
                       │ cost_price   │
                       │ user_id (FK) │
                       └──────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │ stock_movements  │
                    ├──────────────────┤
                    │ id (PK)          │
                    │ product_id (FK)  │←────┘
                    │ type             │ (IN/OUT/ADJUST)
                    │ quantity         │
                    │ reference        │
                    │ notes            │
                    │ user_id (FK)     │
                    │ created_at       │
                    └──────────────────┘
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A **Supabase account** ([Sign up free](https://supabase.com))
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code recommended)

### System Requirements
- **OS:** Windows 10+, macOS 10.15+, or Linux
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 500MB for dependencies and build files

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dashrath-Patel/StockMaster-odoo.git
cd StockMaster-odoo
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Setup Environment Variables

#### Frontend Environment (.env)

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:54321/api
```

#### Backend Environment (backend/.env)

Create a `backend/.env` file:

```bash
cd backend
cp .env.example .env
cd ..
```

Edit `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=54321
FRONTEND_ORIGIN=http://localhost:5173
```

**Important:** Get your Supabase credentials from:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. For backend, copy the **service_role** key (keep this secret!)

---

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** StockMaster
   - **Database Password:** Choose a strong password
   - **Region:** Select nearest to you
4. Click **"Create new project"** and wait for setup

### Step 2: Run Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Open `supabase-schema.sql` from the project
5. Copy and paste the entire SQL script
6. Click **"Run"** or press `Ctrl+Enter`

This will create:
- ✅ All database tables (profiles, categories, suppliers, products, stock_movements, alerts)
- ✅ Row-Level Security (RLS) policies
- ✅ Auto-create profile trigger
- ✅ Stock alert triggers
- ✅ Indexes for performance

### Step 3: Verify Database Setup

Run this query in SQL Editor to verify:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return: alerts, categories, profiles, products, stock_movements, suppliers
```

### Step 4: Seed Dummy Data (Optional)

For testing purposes, you can add sample data:

1. Open `seed-dummy-data.sql`
2. Run it in SQL Editor
3. This creates sample categories, suppliers, and products

---

## 🚀 Running the Application

### Option 1: Run Frontend and Backend Separately

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: **http://localhost:54321**

#### Terminal 2 - Frontend Server

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Option 2: Use Setup Scripts (Linux/Mac)

```bash
# Quick setup
./setup.sh

# Start backend
./start-backend.sh

# Start frontend
npm run dev
```

### Option 3: Windows

**Backend:**
```cmd
cd backend
npm run dev
```

**Frontend (new terminal):**
```cmd
npm run dev
```

### Verify Everything Works

1. Open **http://localhost:5173** in your browser
2. You should see the landing page
3. Click **"Sign Up"** to create an account
4. After signup, you'll be redirected to the dashboard
5. Start adding categories, suppliers, and products!

---

## 📂 Project Structure

```
StockMaster-odoo/
├── backend/                      # Backend Express API
│   ├── src/
│   │   ├── server.js            # Main server file
│   │   ├── lib/
│   │   │   └── supabaseAdmin.js # Supabase admin client
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication
│   │   └── routes/
│   │       ├── categories.js    # Category CRUD endpoints
│   │       ├── products.js      # Product CRUD endpoints
│   │       ├── suppliers.js     # Supplier CRUD endpoints
│   │       ├── stock.js         # Stock movement endpoints
│   │       └── reports.js       # Analytics endpoints
│   ├── tests/
│   │   └── api.test.js          # API tests
│   ├── .env                     # Backend environment variables
│   ├── .env.example             # Backend env template
│   └── package.json             # Backend dependencies
│
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Modal.jsx
│   │   ├── DashboardLayout.jsx  # Main layout with sidebar
│   │   └── ProtectedRoute.jsx   # Auth guard component
│   │
│   ├── pages/                   # Page components
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Login.jsx            # Login page
│   │   ├── SignUp.jsx           # Registration page
│   │   ├── ForgotPassword.jsx   # Password reset request
│   │   ├── ResetPassword.jsx    # Password reset form
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── Products.jsx         # Products management
│   │   ├── Categories.jsx       # Categories management
│   │   ├── Suppliers.jsx        # Suppliers management
│   │   ├── StockMovement.jsx    # Stock movements
│   │   ├── Reports.jsx          # Analytics & reports
│   │   └── Settings.jsx         # User settings
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state
│   │
│   ├── api/
│   │   └── client.js            # API client functions
│   │
│   ├── config/
│   │   └── supabase.js          # Supabase client config
│   │
│   ├── styles/
│   │   └── design-system.js     # Design tokens
│   │
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                       # Static assets
│
├── supabase-schema.sql          # Database schema
├── seed-dummy-data.sql          # Sample data
├── fix-rls-profiles.sql         # RLS fix script
├── convert-to-shared-data.sql   # Convert to shared mode
│
├── .env                         # Frontend environment variables
├── .env.example                 # Frontend env template
├── .gitignore                   # Git ignore rules
├── package.json                 # Frontend dependencies
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
├── tailwind.config.js           # Tailwind configuration
├── index.html                   # HTML entry point
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:54321/api
```

### Authentication
All API endpoints (except `/health`) require authentication. Include the Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

**Create Product Body:**
```json
{
  "name": "Laptop",
  "sku": "LAP-001",
  "description": "15-inch laptop",
  "category_id": "uuid",
  "supplier_id": "uuid",
  "quantity": 10,
  "reorder_level": 5,
  "unit_price": 999.99,
  "cost_price": 750.00
}
```

#### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/:id` | Get single category |
| POST | `/categories` | Create new category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

**Create Category Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices",
  "color": "#3B82F6"
}
```

#### Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suppliers` | Get all suppliers |
| GET | `/suppliers/:id` | Get single supplier |
| POST | `/suppliers` | Create new supplier |
| PUT | `/suppliers/:id` | Update supplier |
| DELETE | `/suppliers/:id` | Delete supplier |

**Create Supplier Body:**
```json
{
  "name": "Tech Corp",
  "contact_email": "sales@techcorp.com",
  "contact_phone": "+1-555-0123",
  "address": "123 Tech Street, CA"
}
```

#### Stock Movements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stock-movements` | Get all movements |
| GET | `/stock-movements/:id` | Get single movement |
| POST | `/stock-movements` | Create movement |

**Create Stock Movement Body:**
```json
{
  "product_id": "uuid",
  "type": "IN",
  "quantity": 50,
  "reference": "PO-12345",
  "notes": "New shipment received"
}
```

#### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/dashboard` | Dashboard statistics |
| GET | `/reports/low-stock` | Low stock products |
| GET | `/reports/inventory-value` | Total inventory value |
| GET | `/reports/category-distribution` | Products by category |

---

## 🔧 Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key | `eyJhbGc...` |
| `VITE_API_URL` | Backend API URL | `http://localhost:54321/api` |

### Backend (backend/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |
| `PORT` | Backend server port | `54321` |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

---

## 📖 Usage Guide

### First Time Setup

1. **Create Account**
   - Go to `/signup`
   - Enter email and password
   - Verify email (check inbox)
   - Login at `/login`

2. **Setup Categories**
   - Navigate to **Categories** page
   - Click **"Add Category"**
   - Choose a color and add description
   - Click **"Create Category"**

3. **Add Suppliers**
   - Go to **Suppliers** page
   - Click **"Add Supplier"**
   - Fill in contact details
   - Click **"Create Supplier"**

4. **Create Products**
   - Navigate to **Products** page
   - Click **"Add Product"**
   - Fill in product details
   - Select category and supplier
   - Set initial quantity and reorder level
   - Click **"Create Product"**

5. **Track Stock**
   - Go to **Stock Movement** page
   - Click **"New Movement"**
   - Select product and movement type
   - Enter quantity and reference
   - Click **"Record Movement"**

### Managing Products

#### Add Product
1. Click **"Add Product"** button
2. Fill in required fields:
   - Name (required)
   - SKU (required, unique)
   - Category (required)
   - Supplier (optional)
   - Quantity (required)
   - Reorder Level (required)
   - Unit Price (required)
   - Cost Price (optional)
3. Click **"Create Product"**

#### Edit Product
1. Find product in table
2. Click **edit icon** (pencil)
3. Update fields
4. Click **"Update Product"**

#### Delete Product
1. Click **delete icon** (trash)
2. Confirm deletion in modal
3. Product and related movements are deleted

#### Search Products
- Use search bar at top
- Filter by name, SKU, or category
- Results update in real-time

### Stock Movement Types

#### Stock IN
- Use for: Purchases, Returns from customers, Production
- Increases product quantity
- Example: Received shipment of 100 units

#### Stock OUT
- Use for: Sales, Returns to supplier, Wastage
- Decreases product quantity
- Example: Sold 50 units to customer

#### Stock ADJUST
- Use for: Physical count corrections, Damaged goods
- Sets exact quantity
- Example: Physical count shows 75 units (not 100)

### Understanding Reports

#### Dashboard
- **Total Products:** Count of all products
- **Low Stock:** Products below reorder level
- **Categories:** Total categories created
- **Suppliers:** Total suppliers in system

#### Charts
- **Inventory Value by Category:** Bar chart showing total value per category
- **Category Distribution:** Pie chart of products per category
- **Stock Movement Trends:** Line chart of movements over time

---

## 🎨 Design System

### Color Palette

```javascript
// Primary Colors
colors.primary = '#3B82F6'    // Blue - Main brand color
colors.secondary = '#8B5CF6'  // Purple - Accent color
colors.success = '#10B981'    // Green - Success states
colors.danger = '#EF4444'     // Red - Error states
colors.warning = '#F59E0B'    // Orange - Warning states
colors.info = '#06B6D4'       // Cyan - Info states

// Neutral Colors
colors.dark = '#1E293B'       // Dark text
colors.light = '#F1F5F9'      // Light backgrounds
colors.white = '#FFFFFF'      // White
colors.black = '#000000'      // Black
```

### Typography

```javascript
// Font Family
fontFamily.sans = 'Inter, system-ui, sans-serif'
fontFamily.mono = 'Fira Code, monospace'

// Font Sizes
fontSize.xs = '0.75rem'    // 12px
fontSize.sm = '0.875rem'   // 14px
fontSize.base = '1rem'     // 16px
fontSize.lg = '1.125rem'   // 18px
fontSize.xl = '1.25rem'    // 20px
fontSize.2xl = '1.5rem'    // 24px
fontSize.3xl = '1.875rem'  // 30px
fontSize.4xl = '2.25rem'   // 36px
```

### Borders

```javascript
// All components use bold borders
borderWidth.default = '3px'
borderWidth.thick = '4px'
borderRadius.default = '0.75rem'  // 12px
```

### Shadows

```javascript
// Hard shadows (neubrutalism style)
shadows.sm = '2px 2px 0 0 #000'
shadows.md = '4px 4px 0 0 #000'
shadows.lg = '6px 6px 0 0 #000'
shadows.xl = '8px 8px 0 0 #000'
```

### Components

#### Button
```jsx
<Button variant="primary" size="md">
  Click Me
</Button>

// Variants: primary, secondary, success, danger, outline
// Sizes: sm, md, lg
```

#### Card
```jsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

#### Input
```jsx
<Input 
  label="Product Name"
  placeholder="Enter name"
  value={name}
  onChange={handleChange}
/>
```

#### Modal
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Add Product">
  <form>...</form>
</Modal>
```

---

## 🐛 Troubleshooting

### Cannot Connect to Supabase

**Problem:** Frontend shows "Failed to connect to Supabase"

**Solutions:**
1. Check `.env` file has correct credentials
2. Verify Supabase project is active (not paused)
3. Check browser console for specific error
4. Ensure URL doesn't have trailing slash
5. Try regenerating API keys in Supabase dashboard

### Products Not Showing

**Problem:** Dashboard shows 0 products but you added some

**Solutions:**
1. Check if you're logged in with correct account
2. Verify RLS policies are created (run `supabase-schema.sql`)
3. Check browser console for 403 errors
4. Run verification query:
   ```sql
   SELECT * FROM products WHERE user_id = auth.uid();
   ```
5. Ensure `user_id` column exists and matches your auth user

### Backend API Not Responding

**Problem:** Frontend can't reach backend at localhost:54321

**Solutions:**
1. Check if backend is running: `cd backend && npm run dev`
2. Verify `PORT` in `backend/.env` matches `VITE_API_URL`
3. Check for port conflicts (kill process on 54321)
4. Check backend console for error messages
5. Verify CORS settings allow `http://localhost:5173`

### Authentication Errors

**Problem:** "Invalid JWT" or "Not authenticated"

**Solutions:**
1. Clear browser localStorage and cookies
2. Logout and login again
3. Check if Supabase JWT secret matches
4. Verify `Authorization` header is sent with requests
5. Check token expiration (Supabase tokens expire after 1 hour)

### Charts Not Rendering

**Problem:** Dashboard charts are blank or not showing

**Solutions:**
1. Ensure you have data in database
2. Check if `recharts` is installed: `npm list recharts`
3. Verify products have valid `unit_price` and `quantity`
4. Check browser console for React errors
5. Try clearing cache and hard reload (Ctrl+Shift+R)

### Low Stock Alerts Not Working

**Problem:** Low stock badges not appearing

**Solutions:**
1. Check if product `quantity` < `reorder_level`
2. Verify `alerts` table exists in database
3. Check if alert trigger is created:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_product_update';
   ```
4. Run `fix-alerts-rls.sql` to fix RLS policies

### Signup Fails

**Problem:** "Failed to create profile" error during signup

**Solutions:**
1. Run `fix-rls-profiles.sql` in Supabase SQL Editor
2. Check if `handle_new_user()` trigger exists
3. Verify email is not already registered
4. Check Supabase Auth settings (Email Auth enabled)
5. Look for error in Supabase logs

### Windows-Specific Issues

**Problem:** Setup scripts don't work on Windows

**Solutions:**
1. Use `.cmd` or PowerShell instead of bash scripts
2. Manually run commands:
   ```cmd
   cd backend
   npm install
   npm run dev
   ```
3. Use Git Bash to run `.sh` scripts
4. Check file paths use correct separators (`\` vs `/`)

### Database Migration Errors

**Problem:** SQL script fails to run

**Solutions:**
1. Run scripts in correct order:
   - `supabase-schema.sql` (first)
   - `fix-rls-profiles.sql` (second)
   - `seed-dummy-data.sql` (optional)
2. Drop existing tables if recreating:
   ```sql
   DROP TABLE IF EXISTS stock_movements CASCADE;
   DROP TABLE IF EXISTS products CASCADE;
   DROP TABLE IF EXISTS suppliers CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS alerts CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```
3. Check for syntax errors in modified SQL
4. Ensure you have database admin permissions

### Performance Issues

**Problem:** App is slow or laggy

**Solutions:**
1. Check database indexes are created
2. Limit query results (pagination)
3. Enable browser cache
4. Optimize images (compress before upload)
5. Use production build: `npm run build`
6. Check Network tab in DevTools for slow requests

---

## 🧪 Testing

### Running Frontend Tests

```bash
npm run test
```

### Running Backend Tests

```bash
cd backend
npm run test
```

### Manual Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can login successfully
- [ ] User can reset password
- [ ] Dashboard shows correct statistics
- [ ] Charts render with data
- [ ] Can create, edit, delete categories
- [ ] Can create, edit, delete suppliers
- [ ] Can create, edit, delete products
- [ ] Can record stock movements
- [ ] Low stock alerts appear
- [ ] Search and filter work
- [ ] Responsive on mobile devices
- [ ] Protected routes redirect to login
- [ ] Logout works correctly

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Vercel:** `vercel --prod`
   - **Netlify:** Drag & drop `dist/` folder

3. Set environment variables in hosting platform

### Backend Deployment (Railway/Render)

1. Push backend to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy from `backend/` directory
5. Update `VITE_API_URL` in frontend

### Supabase (Production)

- Supabase automatically handles scaling
- Enable connection pooling for high traffic
- Set up database backups
- Monitor usage in dashboard

---

## 🤝 Contributing

We welcome contributions! This project was built for the **Odoo x SPIT Hackathon 25**.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 StockMaster Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎯 Hackathon Submission

**Event:** Odoo x SPIT Hackathon 25  
**Team:** Team CodeStorm  
**Category:** Inventory Management System  
**Design Theme:** Neubrutalism  
**Submitted:** November 2025  
**Live Demo:** [https://stock-master-odoo.vercel.app](https://stock-master-odoo.vercel.app)

### Key Highlights

✨ **Unique Design:** Bold neubrutalism UI stands out from traditional inventory systems  
🚀 **Full-Stack:** Complete frontend and backend implementation  
🔐 **Secure:** Row-Level Security with Supabase  
📊 **Data-Driven:** Real-time analytics and reporting  
📱 **Responsive:** Works on desktop, tablet, and mobile  
⚡ **Fast:** Built with modern tech stack (React 19, Vite 7)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/Dashrath-Patel/StockMaster-odoo/issues)
3. Create a [new issue](https://github.com/Dashrath-Patel/StockMaster-odoo/issues/new)
4. Contact the team

---

## 🙏 Acknowledgments

- **Odoo** for organizing the hackathon
- **SPIT** for hosting the event
- **Supabase** for excellent database platform
- **Vercel** for Vite and Next.js
- **Tailwind Labs** for Tailwind CSS
- All open-source contributors

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js Guide](https://expressjs.com/)

---

<div align="center">

**Built with ❤️ using React, Node.js, Supabase, and Tailwind CSS**

⭐ Star this repo if you found it helpful!

[Report Bug](https://github.com/Dashrath-Patel/StockMaster-odoo/issues) · [Request Feature](https://github.com/Dashrath-Patel/StockMaster-odoo/issues)

</div>
