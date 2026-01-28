# Ship Repair Yard - Frontend Documentation

## Project Overview

**Project Name**: Ship Repair Yard Frontend (Mantis Material React)  
**Version**: 3.0.0  
**Technology Stack**: React 18.2.0, Material-UI 5.14.5, Redux Toolkit 2.6.0, React Router 6.15.0  
**Purpose**: A comprehensive web application for managing ship repair operations, maintenance scheduling, docking management, work orders, and inventory tracking.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Core Features](#core-features)
3. [Module-by-Module Documentation](#module-by-module-documentation)
4. [API Layer](#api-layer)
5. [State Management (Redux)](#state-management-redux)
6. [Authentication & Context](#authentication--context)
7. [Components Library](#components-library)
8. [Routing Structure](#routing-structure)
9. [Utilities & Helpers](#utilities--helpers)
10. [Key Dependencies](#key-dependencies)

---

## Project Architecture

### High-Level Structure

```
src/
├── api/              # API client modules for backend communication
├── assets/           # Images, icons, and third-party CSS
├── components/       # Reusable React components
├── contexts/         # React Context for global state (Authentication)
├── hooks/            # Custom React hooks
├── layout/           # Layout wrapper components
├── menu-items/       # Navigation menu configuration
├── pages/            # Page components organized by role/feature
├── redux/            # Redux store, slices, and actions
├── routes/           # Route definitions and guards
├── sections/         # Page sections
├── themes/           # Material-UI theme configuration
├── utils/            # Utility functions and constants
├── App.js            # Root application component
├── config.js         # Application configuration
├── index.js          # Application entry point
```

### Application Flow

```
App.js (Root)
  ├── ThemeCustomization (Material-UI Theme)
  ├── RTLLayout (Right-to-Left Support)
  ├── Locales (Internationalization)
  ├── ScrollTop (Auto-scroll to top)
  ├── Redux Provider (State Management)
  ├── JWTProvider (Authentication Context)
  ├── Notistack (Notifications)
  ├── RouterProvider (React Router)
  └── Snackbar (Global Notifications)
```

---

## Core Features

### 1. **Ship Management**

- Create, read, update, and delete (CRUD) operations for ships
- Track ship details including client information
- View ship-specific docking and repair history
- Filter and search ships with advanced table features

### 2. **Docking Management**

- Schedule ships at docking facilities
- Assign superintendents to docking operations
- Manage docking place availability and allocation
- Track docking timeline and status
- Support for multiple docking places within a shipyard

### 3. **Repair Management**

- Create and track repair jobs associated with dockings
- Manage repair status (INITIATED, APPROVED, BLOCKED, COMPLETED)
- View repair history with status change tracking
- Assign repairs to departments and workers
- Calculate repair costs and timelines

### 4. **Work Order Management**

- Generate work orders from repair jobs
- Assign employees to work orders
- Track work order progress and completion
- Support for work order assignment to multiple workers
- Role-based access (Admin/PM vs Foreman)

### 5. **Inventory Management**

- Maintain centralized inventory of ship repair materials
- Track inventory quantities and availability
- Create inventory orders for specific repairs
- Calculate inventory costs per unit
- Monitor remaining quantities after usage

### 6. **Department Management**

- Create and manage repair departments within shipyards
- Assign foremen to departments
- Manage department-specific users and employees
- Support for hierarchical organizational structure

### 7. **User Management**

- Support for multiple user roles: Admin, Project Manager, Foreman, Department Employee, Client
- Role-based access control (RBAC)
- User assignment to shipyards, departments, and roles
- User creation and management by role type
- Authentication and JWT token management

### 8. **Dashboard & Analytics**

- Welcome/home page for users
- Trade logs tracking
- Trade bar charts for visual analytics
- Trade log details display

---

## Module-by-Module Documentation

### API Layer (`src/api/`)

The API layer provides modules for communicating with the backend REST API. Each module exports functions for CRUD operations.

#### **`ship.js`** - Ship Management API

**Purpose**: Handles all ship-related API calls  
**Key Functions**:

- `fetchShipsApi({ shipyardID, queryParams })` - Fetch ships for a specific shipyard
- `fetchShipApi(shipID)` - Fetch individual ship details
- `createShipApi(data)` - Create new ship
- `updateShipApi(id, data)` - Update existing ship
- `deleteShipApi(id)` - Delete ship (if function exists)

**Data Endpoints**:

- GET `/v1/ships` - List ships
- GET `/v1/ships/:id` - Get ship details
- POST `/v1/ships` - Create ship
- PUT `/v1/ships/:id` - Update ship

#### **`docking.js`** - Docking Management API

**Purpose**: Manages docking operations and facility assignments  
**Key Functions**:

- `fetchDockingsApi({ shipyardID, queryParams })` - Get dockings for shipyard with filters
- `createDockingApi(data)` - Create new docking record
- `updateDockingApi(id, data)` - Update docking details
- `getDockingNamesForRepair(shipyardID)` - Get docking options for repair creation

**Data Endpoints**:

- GET `/v1/dockings` - List dockings
- POST `/v1/dockings` - Create docking
- PUT `/v1/dockings/:id` - Update docking
- GET `/v1/dockings/names` - Get docking names

#### **`dockingPlaces.js`** - Docking Places API

**Purpose**: Manages available docking facilities/berths  
**Key Functions**:

- `getAvailableDockingPlaces(shipyardID)` - Get available docking spots

**Data Endpoints**:

- GET `/v1/docking-places/available` - Get available docking places

#### **`repair.js`** - Repair Management API

**Purpose**: Handles repair job creation and status management  
**Key Functions**:

- `fetchRepairsApi(dockingID)` - Get repairs for specific docking
- `createRepairApi(data)` - Create new repair
- `updateRepairApi(id, data)` - Update repair details
- `updateRepairStatus(id, data)` - Update repair status (INITIATED, APPROVED, BLOCKED, COMPLETED)
- `getRepairHistory(id)` - Fetch repair status history
- `createInventoryOrder(repairID, data)` - Create inventory order for repair

**Data Endpoints**:

- GET `/v1/repairs` - List repairs
- POST `/v1/repairs` - Create repair
- PUT `/v1/repairs/:id` - Update repair
- PUT `/v1/repairs/:id/status` - Update repair status
- GET `/v1/repairs/:id/history` - Get repair history
- POST `/v1/repairs/:id/inventory-order` - Create inventory order

#### **`workOrder.js`** - Work Order Management API

**Purpose**: Manages work orders and employee assignments  
**Key Functions**:

- `fetchWorkOrdersApi()` - Get all work orders
- `createWorkOrderApi(data)` - Create new work order
- `updateWorkOrderApi(id, data)` - Update work order
- `AssignWorkOrderEmployeesApi(id, data)` - Assign employees to work order

**Data Endpoints**:

- GET `/v1/work-orders` - List work orders
- POST `/v1/work-orders` - Create work order
- PUT `/v1/work-orders/:id` - Update work order
- PUT `/v1/work-orders/:id/assign-employees` - Assign employees

#### **`inventory.js`** (in `shipyard.js`)

**Purpose**: Inventory management for shipyards  
**Key Functions**:

- `fetchInventoriesApi(shipyardID)` - Get all inventory items
- `fetchInventoryApi(shipyardID, inventoryID)` - Get specific inventory
- `createInventoryApi(shipyardID, data)` - Create inventory item
- `updateInventoryApi(shipyardID, inventoryID, data)` - Update inventory
- `deleteInventoryApi(shipyardID, inventoryID)` - Delete inventory

**Data Endpoints**:

- GET `/v1/shipyards/:id/inventories` - List inventories
- GET `/v1/shipyards/:id/inventory/:inventoryID` - Get inventory details
- POST `/v1/shipyards/:id/inventory` - Create inventory
- PUT `/v1/shipyards/:id/inventory/:inventoryID` - Update inventory
- DELETE `/v1/shipyards/:id/inventory/:inventoryID` - Delete inventory

#### **`department.js`** - Department Management API

**Purpose**: Manages departments within shipyards  
**Key Functions**:

- `getDepartments(shipyardID)` - Get all departments
- `getDepartment(departmentID)` - Get specific department
- `createDepartment(data)` - Create new department
- `updateDepartment(departmentID, data)` - Update department
- `deleteDepartment(departmentID)` - Delete department

**Data Endpoints**:

- GET `/v1/shipyards/:id/departments` - List departments
- GET `/v1/departments/:id` - Get department details
- POST `/v1/departments` - Create department
- PUT `/v1/departments/:id` - Update department
- DELETE `/v1/departments/:id` - Delete department

#### **`user.js`** - User Management API

**Purpose**: Handles user creation, fetching, and updates  
**Key Functions**:

- `fetchUsersAPI()` - Get all users
- `createUserAPI(data)` - Create new user
- `updateUserAPI(id, data)` - Update user
- `getClientSpecificSuperintendents(id)` - Get superintendents for specific client
- `getAvailableEmployees({ foreman_id, department_id })` - Get available employees
- `deleteUserAPI(id)` - Delete user

**Data Endpoints**:

- GET `/v1/users` - List users
- POST `/v1/users` - Create user
- PUT `/v1/users/:id` - Update user
- GET `/v1/users/:id/superintendents` - Get client superintendents
- GET `/v1/users/employees/available` - Get available employees
- DELETE `/v1/users/:id` - Delete user

#### **`role.js`** - Role Management API

**Purpose**: Fetch available roles for user assignments  
**Key Functions**:

- `fetchRolesAPI()` - Get all available roles

**Data Endpoints**:

- GET `/v1/roles` - List roles

#### **`shipyard.js`** - Shipyard Management API

**Purpose**: Core shipyard operations (facilities, users, inventory)  
**Key Functions**:

- `fetchShipyardsApi()` - Get all shipyards
- `fetchShipyardApi(id)` - Get specific shipyard
- `createShipyardApi(data)` - Create shipyard
- `updateShipyardApi(id, data)` - Update shipyard
- `deleteShipyardApi(id)` - Delete shipyard
- `shipyardSpecificUsersAPI({ shipyard_id, query_params })` - Get shipyard users
- `createSYUserApi({ shipyard_id, data })` - Create user for shipyard
- Various inventory management functions

**Data Endpoints**:

- GET `/v1/shipyards` - List shipyards
- GET `/v1/shipyards/:id` - Get shipyard details
- POST `/v1/shipyards` - Create shipyard
- PUT `/v1/shipyards/:id` - Update shipyard
- DELETE `/v1/shipyards/:id` - Delete shipyard
- GET `/v1/shipyards/:id/users` - Get shipyard users
- POST `/v1/shipyards/:id/user` - Create shipyard user

#### **`client.js`** - Client Management API

**Purpose**: Manages client companies and their operations  
**Key Functions**: (From semantic search context)

- Fetch clients associated with shipyards
- Client-specific operations

#### **`menu.js`** - Menu API

**Purpose**: Fetch menu items and navigation structures  
**Key Functions**: (From semantic search context)

- Dynamic menu generation based on user role

---

### Pages Layer (`src/pages/`)

Pages are full-screen components organized by role and feature.

#### **Admin Pages** (`src/pages/admin/`)

##### **`ManageShips.js`** - Ship Management Interface

**Purpose**: Complete CRUD interface for managing ships  
**Key Features**:

- **Advanced React Table**:
  - Sorting by multiple columns
  - Global search with fuzzy filtering
  - Pagination with configurable page size
  - Row selection with multi-select support
  - Expandable rows for ship details
- **Search & Filter**: DebouncedInput for search-as-you-type
- **Actions**:
  - Create new ship (PlusOutlined icon)
  - Edit ship (EditOutlined icon)
  - Delete ship (DeleteOutlined icon)
- **Modals**: AddEditShipModal for form handling
- **Dependencies**: Ships from Redux, Client data from API
- **Responsive Design**: Adapts to mobile/tablet/desktop

**User Interaction Flow**:

1. User lands on ManageShips page
2. Fetches available ships from Redux (via dispatch)
3. Displays ships in advanced table with sorting/filtering
4. User clicks "Create Inventory" button → Opens AddEditShipModal
5. User fills form → Submits → API call → Redux updates → Table refreshes

##### **`ManageDockings.js`** - Docking Operations Management

**Purpose**: Schedule and manage ship dockings at facilities  
**Key Features**:

- **Docking Table**:
  - Lists all dockings with dates and statuses
  - Shows associated ship and docking place
  - Searchable and sortable
- **Add/Edit Docking**: Modal form for docking creation and updates
- **Add Superintendent**: Separate modal to assign superintendents to docking
- **Filtering**: By shipyard, ship, or date range
- **Dependency Validation**: Shows helpful messages when required data is missing
- **Status Tracking**: Track docking lifecycle from scheduled to completed

**Workflow**:

1. Admin navigates to ManageDockings
2. Fetches dockings for their shipyard
3. Can filter by ships or other criteria
4. Creates new docking → Assigns docking place
5. Can add/remove superintendents for supervision
6. Tracks docking progress and completion

##### **`ManageRepairs.js`** - Repair Job Management

**Purpose**: Central hub for all repair operations  
**Key Features**:

- **Repair Status Management**:
  - Color-coded status chips (INITIATED, APPROVED, BLOCKED, COMPLETED)
  - Status update modal with validation
  - Status history tracking
- **Repair Details**:
  - Associated docking and ship information
  - Linked work orders
  - Inventory requirements
  - Cost calculations
- **Advanced Filtering**:
  - By docking, ship, status, date range
  - Real-time search across all repair fields
- **Work Orders**:
  - View work orders linked to repair
  - Create new work orders
  - Assign employees via work orders
- **Inventory Orders**:
  - Add inventory needs for repair
  - Track material costs
  - Update remaining quantities

**Status Lifecycle**:

```
INITIATED → APPROVED → (BLOCKED or COMPLETED)
         ↓
      BLOCKED (can return to APPROVED)
```

**Key Interactions**:

- Drill-down from docking to see repairs
- Expand repair rows to see history and details
- Open work order management
- Open inventory order management

##### **`ManageDepartments.js`** - Department Structure Management

**Purpose**: Define organizational departments within shipyard  
**Key Features**:

- **Department CRUD**: Create, edit, delete departments
- **Department Details**: Name, foreman assignment
- **User Assignment**: Manage employees within departments
- **Foreman Management**: Assign and manage department heads
- **Hierarchical View**: Show department structure with users

**Typical Operations**:

1. Create departments (e.g., Welding, Electrical, Mechanical)
2. Assign a foreman to each department
3. Add employees under foreman supervision
4. Track department capacity and workload

##### **`ManageInventory.js`** - Material Inventory System

**Purpose**: Track repair materials and supplies  
**Key Features**:

- **Inventory Table**:
  - Item name, total quantity, remaining quantity
  - Creator information
  - Searchable and sortable
- **Add/Edit Inventory**: Modal for inventory management
  - Set initial quantity
  - Track remaining after usage
  - Cost per unit information
- **Quantity Tracking**:
  - Total quantity (stock received)
  - Remaining quantity (after allocations)
  - Automatic updates when used in repairs
- **Filtering**: By shipyard or date range

**Usage Flow**:

1. Inventory manager adds new materials
2. Sets total quantity available
3. As repairs use materials, remaining quantity decreases
4. System prevents over-allocation (validation)
5. Can view inventory orders linked to repairs

##### **`ManageWorkOrders.js`** - Work Order Coordination

**Purpose**: Coordinate work orders across repairs and departments  
**Key Features**:

- **Hierarchical Selection**:
  - Select Ship → View Dockings
  - Select Docking → View Repairs
  - Select Repair → View/Manage Work Orders
- **Work Order List**: Shows all work orders for selected repair
- **Employee Assignment**: Assign foreman and employees
- **Inventory Orders**: View materials allocated to work order
- **Status Tracking**: Monitor work order progress
- **Department Filtering**: Filter by assigned department

**Workflow**:

1. Admin/PM selects ship in docking
2. Selects docking to see repairs
3. Selects specific repair
4. Views and manages associated work orders
5. Can assign employees from available pool
6. Allocates inventory items with quantities
7. Tracks completion and costs

##### **`ManageAdministratorUsers.js`** - Admin User Management

**Purpose**: Create and manage administrator-level users  
**Key Features**:

- User table with admin-specific columns
- Email address display (required for admins)
- Create new admin users
- Edit admin details
- Delete admin users

##### **`ManageClientUser.js`** - Client User Management

**Purpose**: Manage client company representatives  
**Key Features**:

- Client user table with company information
- Email and phone contact details
- Company name association
- Create client users
- Edit client profiles
- Delete client access

##### **`ManageDeptUsers.js`** - Department Employee Management

**Purpose**: Manage employees working in departments  
**Key Features**:

- Employee table with department association
- Foreman assignment tracking
- Email and contact information
- Create department employees
- Edit employee roles/assignments
- Delete employees

##### **`ManageShipDetail.js`** - Detailed Ship Information

**Purpose**: View comprehensive ship profile  
**Features**:

- Complete ship specifications
- Docking history
- Repair history
- Client information
- Linked documents (if any)

---

#### **Dashboard Pages** (`src/pages/dashboard/`)

##### **`WelcomePage.js`** - User Dashboard Home

**Purpose**: Welcome screen and key statistics  
**Features**:

- Welcome banner with ship repair yard information
- Quick stats dashboard
- Navigation shortcuts to key features
- Company information and overview

**Content**:

```
Welcome to Ship Repair Yard
The Ship Repair Yard is here to keep ships in good working
condition. We handle repairs, maintenance, and upgrades to
make sure vessels are safe and ready to sail.
```

##### **`TradeLogs.js`** - Activity Logs

**Purpose**: View all activities and transactions  
**Features**:

- Log entries for all operations
- Timestamp and user tracking
- Action description
- Filterable by type, user, date

##### **`TradeLogDetails.js`** - Log Detail View

**Purpose**: Detailed view of specific log entry  
**Features**:

- Complete information about action
- Before/after state comparison
- User who performed action
- Timestamp and IP address

##### **`TradeBarChart.js`** - Analytics Visualization

**Purpose**: Visual analysis of repair metrics  
**Features**:

- ApexCharts for data visualization
- Multiple chart types (bar, line, etc.)
- Time-based analytics
- Trend analysis

---

#### **Authentication Pages** (`src/pages/auth/`)

##### **`login.js`** - User Authentication

**Purpose**: Login interface  
**Features**:

- Email/username and password fields
- JWT token generation and storage
- Error handling
- Remember me option
- Links to registration and password recovery

##### **`register.js`** - User Registration

**Purpose**: New user account creation  
**Features**:

- User information form
- Role selection
- Shipyard assignment
- Email verification
- Password strength validation

---

#### **Super Admin Pages** (`src/pages/super-admin/`)

##### **`Shipyard.js`** - Shipyard Management

**Purpose**: Super admin shipyard operations  
**Features**:

- Create/edit shipyards
- Manage shipyard details (location, capacity)
- Assign managers to shipyards
- View all shipyard statistics

##### **`UserManage.js`** - Global User Management

**Purpose**: Super admin user administration  
**Features**:

- View all users across shipyards
- Create super admin users
- Assign roles and permissions
- Manage user access levels

---

#### **Docking Master Pages** (`src/pages/docking-master/`)

##### **`ManageDockingPlaces.js`** - Docking Facility Management

**Purpose**: Manage physical docking locations/berths  
**Features**:

- List available docking places
- Add new docking places
- Edit docking place details
- Track docking place status (available/occupied)
- View docking schedule for places

---

#### **Maintenance Pages** (`src/pages/maintenance/`)

##### **`404.js`** - Not Found Page

**Purpose**: 404 error handling  
**Features**:

- Friendly error message
- Navigation back to home
- Helpful suggestions

---

### Components Library (`src/components/`)

Reusable UI components for consistent design and functionality.

#### **Core Layout Components**

##### **`MainCard.js`** - Standard Content Container

**Purpose**: Wrapper component for page content  
**Features**:

- Consistent styling and spacing
- Optional shadow/border
- Support for modal rendering
- Content padding management

##### **`Loader.js`** - Loading State Indicator

**Purpose**: Display loading spinner  
**Features**:

- Centered spinner animation
- Full-page or inline sizes
- Customizable loading message

##### **`ScrollTop.js`** - Auto-scroll Utility

**Purpose**: Scroll to top on route change  
**Features**:

- Automatic behavior on navigation
- Manual trigger available

##### **`ScrollX.js`** - Horizontal Scroll Container

**Purpose**: Horizontal scroll for wide tables  
**Features**:

- SimpleBar integration for styled scrollbars
- Maintains vertical scroll
- Mobile-friendly overflow handling

##### **`RTLLayout.js`** - Right-to-Left Support

**Purpose**: Enable RTL language support  
**Features**:

- Conditional layout direction
- Theme-aware implementation

##### **`Locales.js`** - Internationalization

**Purpose**: Language and locale management  
**Features**:

- React-Intl integration
- Multi-language support
- Date/time formatting per locale

##### **`AlerDelete.js`** - Delete Confirmation Dialog

**Purpose**: Confirm destructive actions  
**Features**:

- Modal dialog
- Confirmation buttons
- Cancel option
- Error handling

---

#### **Extended Components** (`src/components/@extended/`)

##### **`AnimateButton.js`** - Button Animation

**Purpose**: Interactive button with animation  
**Features**:

- Framer-motion integration
- Hover effects
- Click animations
- Customizable animation types

##### **`Avatar.js`** - User Avatar Display

**Purpose**: Display user profile pictures  
**Features**:

- Image fallback to initials
- Multiple size options
- Color variants
- Badge support

##### **`Breadcrumbs.js`** - Navigation Breadcrumb

**Purpose**: Show current location in hierarchy  
**Features**:

- Clickable navigation
- Custom separator
- Icon support

##### **`Dot.js`** - Status Indicator Dot

**Purpose**: Show status with colored dot  
**Features**:

- Multiple color options
- Size variants
- Animation support

##### **`IconButton.js`** - Icon-based Button

**Purpose**: Button with icon and optional text  
**Features**:

- Multiple icon integrations
- Tooltip support
- Size variants
- Color variants

##### **`NoDataMessage.js`** - Empty State Component

**Purpose**: Display when no data available  
**Features**:

- Friendly message
- Optional illustration
- Action button support

##### **`Snackbar.js`** - Toast Notification

**Purpose**: Global notification system  
**Features**:

- Auto-dismiss
- Multiple positions
- Action buttons
- Multiple severity levels

##### **`Transitions.js`** - Animation Wrapper

**Purpose**: Apply transitions to components  
**Features**:

- Framer-motion wrapper
- Multiple transition types
- Direction variants

##### **`progress/`** - Progress Indicators

**Purpose**: Visual progress representation  
**Features**:

- Circular progress
- Linear progress
- Animated transitions

---

#### **Feature-Specific Components**

##### **`ships/AddEditShipModal.js`** - Ship Form Modal

**Purpose**: Modal for creating/editing ships  
**Components**:

- Modal wrapper
- Form with validation
- Client selection
- Ship details (name, type, length, breadth, draft)
- Error messages
- Submit button

##### **`ships/FormAddEditShip.js`** - Ship Form Body

**Purpose**: Actual form for ship data  
**Features**:

- Formik for form management
- Yup for validation
- TextField inputs for ship properties
- Client dropdown selection
- Submit error handling

##### **`docking/DokcingModal.js`** - Docking Form Modal

**Purpose**: Modal for docking operations  
**Features**:

- Docking place selection
- Ship selection
- Date range picker
- Superintendent assignment
- Status selection

##### **`docking/FormAddEditDocking.js`** - Docking Form

**Purpose**: Form body for docking  
**Features**:

- Docking details input
- Date range selection
- Place availability check
- Superintendent list

##### **`docking/AddSuperintendentModal.js`** - Superintendent Assignment

**Purpose**: Modal to add superintendents  
**Features**:

- List of available superintendents
- Multi-select support
- Client-specific filtering
- Remove superintendent option

##### **`docking/FormAddSuperintendent.js`** - Superintendent Form

**Purpose**: Form for superintendent assignment  
**Features**:

- Superintendent dropdown
- Validation
- Submit handling

##### **`docking-places/DockingPlaceModal.js`** - Docking Place Management

**Purpose**: Modal for docking place operations  
**Features**:

- Create/edit docking places
- Place details (name, capacity)
- Status management

##### **`department/DepartmentModal.js`** - Department Management Modal

**Purpose**: Modal for department operations  
**Features**:

- Department name and details
- Foreman assignment
- Department creation/editing

##### **`repair/RepairModal.js`** - Repair Job Modal

**Purpose**: Modal for repair operations  
**Features**:

- Repair description
- Docking selection
- Work type selection
- Priority level
- Cost estimation

##### **`repair/FormAddEditRepair.js`** - Repair Form Body

**Purpose**: Form for repair details  
**Features**:

- Repair type selection
- Description field
- Cost fields
- Timeline fields
- Validation

##### **`repair/UpdateStatusModal.js`** - Repair Status Update

**Purpose**: Modal to update repair status  
**Features**:

- Status dropdown (INITIATED, APPROVED, BLOCKED, COMPLETED)
- Comments for status change
- Status history reference
- Validation

##### **`repair/RepairHistory.js`** - Repair History Display

**Purpose**: Show repair status changes over time  
**Features**:

- Timeline view of status changes
- Timestamp for each change
- User who made change
- Comments/notes

##### **`inventory/InventoryModal.js`** - Inventory Management Modal

**Purpose**: Modal for inventory operations  
**Features**:

- Modal wrapper for inventory form

##### **`inventory/FormAddEditInventory.js`** - Inventory Item Form

**Purpose**: Form for inventory management  
**Features**:

- Inventory name input
- Total quantity field
- Remaining quantity field (edit only)
- Shipyard selection
- Validation rules
- Cost per unit

##### **`work-order/WorkOrderTable.js`** - Work Order Display Table

**Purpose**: Display work orders in table format  
**Features**:

- Searchable and sortable table
- Edit work order action
- Delete work order action
- Expandable rows
- Pagination support

##### **`work-order/WorkOrderModal.js`** - Work Order Creation Modal

**Purpose**: Modal for creating/editing work orders  
**Features**:

- Work order details form
- Employee assignment
- Status tracking

##### **`work-order/FormAddEditWorkOrder.js`** - Work Order Form Body

**Purpose**: Form for work order details  
**Features**:

- Description field
- Foreman selection
- Department selection
- Employee assignment
- Status selection
- Timeline fields

##### **`work-order/Dropdown.js`** - Hierarchical Selection

**Purpose**: Cascading dropdown for ship→docking→repair  
**Features**:

- Multi-level selection
- Dependent dropdowns
- Clear on parent change

##### **`work-order/RepairCard.js`** - Repair Summary Card

**Purpose**: Display repair information in card format  
**Features**:

- Repair status
- Associated work orders count
- Quick action buttons
- Cost summary

##### **`work-order/InventoryOrderTable.js`** - Inventory Order Display

**Purpose**: Show inventory orders for repair  
**Features**:

- Item name
- Quantity allocated
- Cost per unit
- Total cost calculation
- Edit/Delete actions

##### **`work-order/FormAddEditInventoryOrder.js`** - Inventory Order Form

**Purpose**: Form for allocating inventory to repair  
**Features**:

- Inventory selection dropdown
- Quantity input with validation
- Cost per unit field
- Remaining quantity check
- Validation against available stock

##### **`work-order/InfoMessage.js`** - Helpful Info Display

**Purpose**: Show guidance messages  
**Features**:

- Missing selection warnings
- Helpful tooltips
- Next step suggestions

##### **`users/UserModal.js`** - User Management Modal

**Purpose**: Modal for user creation/editing  
**Features**:

- Modal wrapper for user form

##### **`users/AlertDelete.js`** - User Delete Confirmation

**Purpose**: Confirm user deletion  
**Features**:

- Delete warning
- Confirm/Cancel options
- Error handling

##### **`react-table/empty.js`** - Empty Table State

**Purpose**: Display when table has no data  
**Features**:

- Friendly empty message
- Optional action button

##### **`shipyard/AlertDelete.js`** - Shipyard Delete Confirmation

**Purpose**: Confirm shipyard deletion  
**Features**:

- Deletion warning
- Confirm/Cancel buttons

##### **`logo/`** - Logo Components

- **`LogoMain.js`**: Main application logo
- **`LogoIcon.js`**: Icon-only logo variant

##### **`third-party/`** - Third-party Components

- **`Notistack.js`**: Notification management
- **`SimpleBar.js`**: Scrollbar styling

---

### Redux Store (`src/redux/`)

State management using Redux Toolkit.

#### **Store Configuration** (`src/redux/store.js`)

- Combines all feature slices
- Configures Redux middleware
- Enables Redux DevTools for development

#### **Feature Slices** (`src/redux/features/`)

##### **`ships/`** - Ship State Management

**Slice**: shipSlice (state/actions/reducers)
**Actions**: fetchShips, createShip, updateShip, deleteShip
**State Structure**:

```javascript
{
  ships: [],           // Array of ship objects
  ship: {},            // Selected ship
  status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  successMessage: null
}
```

##### **`dockings/`** - Docking State Management

**Slice**: dockingSlice
**Actions**: fetchDockings, createDocking, updateDocking, deleteDocking
**State Structure**:

```javascript
{
  dockings: [],
  docking: {},
  status: 'idle',
  error: null,
  successMessage: null
}
```

##### **`repair/`** - Repair State Management

**Slice**: repairSlice
**Actions**: fetchRepairs, createRepair, updateRepair, deleteRepair, updateRepairStatus
**State Structure**:

```javascript
{
  repairs: [],
  repair: {},
  repairHistory: [],
  status: 'idle',
  error: null,
  successMessage: null
}
```

##### **`work-order/`** - Work Order State Management

**Slice**: workOrderSlice
**Actions**: fetchWorkOrders, createWorkOrder, updateWorkOrder, assignEmployees
**State Structure**:

```javascript
{
  workOrders: [],
  workOrder: {},
  inventoryOrders: [],
  status: 'idle',
  error: null
}
```

##### **`inventory/`** - Inventory State Management

**Slice**: inventorySlice
**Actions**: fetchInventories, createInventory, updateInventory, deleteInventory, updateInventoryQtyBatch
**State Structure**:

```javascript
{
  inventories: [],
  inventory: {},
  status: 'idle',
  error: null,
  successMessage: null
}
```

##### **`users/`** - User State Management

**Slice**: userSlice
**Actions**: fetchUsers, createUser, updateUser, deleteUser
**State Structure**:

```javascript
{
  users: [],
  user: {},
  roles: [],
  status: 'idle',
  error: null
}
```

##### **`roles/`** - Role State Management

**Slice**: rolesSlice
**Actions**: fetchRoles
**State Structure**:

```javascript
{
  roles: [],
  status: 'idle',
  error: null
}
```

##### **`shipyard/`** - Shipyard State Management

**Slice**: shipyardSlice
**Actions**: fetchShipyards, setSelectedShipyard
**State Structure**:

```javascript
{
  shipyards: [],
  shipyard: {},
  status: 'idle',
  error: null
}
```

---

### Authentication & Context (`src/contexts/`)

#### **`JWTContext.js`** - JWT Authentication Context

**Purpose**: Manage user authentication and authorization  
**Features**:

- JWT token verification
- Token storage in localStorage
- Axios header authorization setup
- Login/logout functionality
- User state management

**Context Methods**:

- `verifyToken(serviceToken)` - Check if token is valid and not expired
- `setSession(serviceToken)` - Store token and set authorization header
- `login(email, password)` - Authenticate user
- `logout()` - Clear token and user session
- `register(email, password, name)` - Create new user account

**Context Value**:

```javascript
{
  isLoggedIn: boolean,
  isInitialized: boolean,
  user: {
    id: string,
    email: string,
    name: string,
    role: string,
    shipyard_id: string,
    ...
  }
}
```

#### **`auth-reducer/`** - Authentication Reducer

**Purpose**: State management for auth context  
**Actions**: LOGIN, LOGOUT
**Reducer Logic**: Handle login/logout state transitions

---

### Custom Hooks (`src/hooks/`)

#### **`useAuth.js`** - Authentication Hook

**Purpose**: Easy access to auth context  
**Returns**: Auth context object with user and methods
**Usage**:

```javascript
const { user, isLoggedIn, login, logout } = useAuth();
```

#### **`useConfig.js`** - Configuration Hook

**Purpose**: Access application configuration  
**Returns**: Config values

#### **`useLocalStorage.js`** - Local Storage Hook

**Purpose**: React hook for localStorage  
**Features**:

- Get/Set values with hooks
- Auto-sync between tabs
- Type-safe retrieval

#### **`useScriptRef.js`** - Script Reference Hook

**Purpose**: Manage script element references  
**Usage**: For external script loading

---

### Routes (`src/routes/`)

#### **`router.js`** - Main Router Configuration

**Purpose**: Create browser router with all routes  
**Structure**: Uses AppRoutes component to define route hierarchy

#### **`index.js`** - Route Definitions

**Purpose**: Define all application routes
**Route Structure**:

```
/ (Landing)
├── /auth
│   ├── /login
│   └── /register
├── /dashboard
│   ├── /welcome
│   ├── /work-orders
│   ├── /inventories
│   ├── /trade-logs
│   └── ... (role-based)
├── /admin
│   ├── /ships
│   ├── /dockings
│   ├── /repairs
│   ├── /departments
│   ├── /inventories
│   ├── /work-orders
│   ├── /users/admin
│   ├── /users/client
│   └── /users/department
├── /super-admin
│   ├── /shipyards
│   └── /users
└── /404
```

#### **`RoleBasedRoutes.js`** - Role-Based Access Control

**Purpose**: Restrict routes by user role  
**Roles Supported**:

- SUPER_ADMIN - Access to all routes
- ADMIN - Shipyard-level management
- PROJECT_MANAGER - Project oversight
- FOREMAN - Department and worker management
- EMPLOYEE - Limited to assigned tasks
- CLIENT - View own ships and repairs

#### **`LoginRoutes.js`** - Authentication Routes

**Purpose**: Routes available only to non-authenticated users  
**Routes**: Login, Register, Password Recovery

#### **`MainRoutes.js`** - Main Application Routes

**Purpose**: Routes available to authenticated users  
**Includes**: Dashboard, Admin, Super Admin routes

#### **`ErrorBoundary.js`** - Error Handling

**Purpose**: Catch and display React errors  
**Features**:

- Error page display
- Error logging
- Fallback UI

---

### Utilities (`src/utils/`)

#### **`constants.js`** - Application Constants

**Purpose**: Centralized constants and configurations  
**Key Exports**:

- **Table Column Definitions**:

  - `shipColumns` - Ship table columns
  - `dockingColumns` - Docking table columns
  - `repairColumns` - Repair table columns
  - `workOrderColumns` - Work order table columns
  - `inventoryColumns` - Inventory table columns
  - `inventoryOrderColumns` - Inventory order columns
  - `departmentColumns` - Department columns
  - `userTableColumns(role)` - Role-specific user columns
  - `shipyardColumnsWithoutActions` - Shipyard columns

- **Status Definitions**:
  - Repair statuses
  - Work order statuses
  - Docking statuses

#### **`dataApi.js`** - Axios Instance

**Purpose**: Configured axios client for API calls  
**Features**:

- Base URL configuration
- Default headers
- Interceptors for error handling
- JWT token injection

#### **`axios.js`** - Axios Configuration

**Purpose**: Additional axios setup  
**Features**:

- Custom error handling
- Request/response interceptors
- Timeout configuration

#### **`password-validation.js`** - Password Rules

**Purpose**: Password validation logic  
**Features**:

- Strength calculation
- Requirement checking
- Format validation

#### **`password-strength.js`** - Strength Indicator

**Purpose**: Visual password strength indication  
**Features**:

- Strength levels
- Color coding

#### **`getColors.js`** - Color Utility

**Purpose**: Get colors from theme  
**Functions**: Theme-aware color selection

#### **`getShadow.js`** - Shadow Utility

**Purpose**: Get shadow values from theme  
**Functions**: Consistent shadow application

#### **`SyntaxHighlight.js`** - Code Highlighting

**Purpose**: Display highlighted code snippets  
**Features**: React-syntax-highlighter integration

#### **`locales/`** - Internationalization Files

**Purpose**: Language translation files  
**Support**: Multiple language translations

#### **`route-guard/`** - Route Protection

**Purpose**: Middleware for protecting routes  
**Features**:

- Authentication checks
- Role verification
- Redirect logic

---

### Themes (`src/themes/`)

#### **`index.js`** - Theme Provider

**Purpose**: Apply Material-UI theme to app  
**Features**:

- Light/Dark mode support
- Color scheme customization
- Typography configuration

#### **`palette.js`** - Color Palette

**Purpose**: Define color scheme  
**Colors**: Primary, secondary, error, warning, info, success
**Features**: Mode-specific colors (light/dark)

#### **`shadows.js`** - Shadow Definitions

**Purpose**: Consistent shadow values  
**Features**: Elevation-based shadows

#### **`typography.js`** - Font Configuration

**Purpose**: Define typography rules  
**Fonts**: Inter, Poppins, Public Sans, Roboto
**Features**: Responsive font sizes

#### **`overrides/`** - Component Overrides

**Purpose**: Customize Material-UI components  
**Components**: Button, Card, Input, Table, etc.

#### **`theme/`** - Theme Configuration

**Purpose**: Centralized theme setup  
**Features**: Mode switching, color variables

---

### Layout Components (`src/layout/`)

#### **`Auth/`** - Authentication Layout

**Purpose**: Layout wrapper for auth pages  
**Features**:

- Minimal navigation
- Background styling
- Center alignment for forms

#### **`Dashboard/`** - Main Application Layout

**Purpose**: Layout for main dashboard  
**Features**:

- Sidebar navigation
- Header with user info
- Main content area
- Responsive drawer

#### **`Pages/`** - Page Layout

**Purpose**: Wrapper for individual pages  
**Features**:

- Breadcrumb navigation
- Page title
- Action buttons

---

### Assets (`src/assets/`)

#### **`images/`** - Image Resources

- Welcome banner images
- User profile images
- Icon images
- Logo assets

#### **`third-party/`** - Third-party Assets

- **`apex-chart.css`** - ApexCharts styling
- **`react-table.css`** - React Table custom styles

---

### Menu Items (`src/menu-items/`)

#### **`dashboard.js`** - Navigation Menu Configuration

**Purpose**: Define sidebar menu items by role  
**Roles Supported**:

- SUPER_ADMIN: Shipyard and user management
- ADMIN: Full shipyard operations
- PROJECT_MANAGER: Project oversight
- FOREMAN: Work orders and team management
- EMPLOYEE: Dashboard and assigned tasks
- CLIENT: Ship and repair view

**Menu Structure**:

```javascript
{
  id: 'unique-id',
  title: 'Menu Item Name',
  type: 'item' | 'group',
  url: '/route-path',
  icon: <IconComponent />,
  breadcrumbs: false,
  ...(role-specific config)
}
```

---

## API Layer Deep Dive

### API Communication Pattern

All API calls follow a consistent pattern:

1. **API Module** (`src/api/*.js`)

   - Exports async functions
   - Uses axios instance for HTTP calls
   - Error handling with try/catch
   - Returns parsed data

2. **Redux Thunk Actions** (`src/redux/features/*/actions.js`)

   - Dispatch loading/success/failure actions
   - Call API module functions
   - Update Redux store
   - Handle errors with toast notifications

3. **Components** (`src/pages/` and `src/components/`)
   - Dispatch Redux actions
   - Subscribe to Redux store
   - Render data from store
   - Display loading/error states

### Complete Data Flow Example: Creating a Ship

```
1. User clicks "Create Ship" button
   ↓
2. AddEditShipModal opens
   ↓
3. User fills form and submits
   ↓
4. FormAddEditShip.js calls: dispatch(createShips(shipData))
   ↓
5. Redux Action (ships/actions.js):
   - dispatch(requestStart())
   - Calls: createShipApi(shipData)
   - API module (ship.js): axios.post('v1/ships', data)
   - Backend processes and returns ship
   - dispatch(createShip(newShipData))
   ↓
6. Redux Store updates with new ship
   ↓
7. ManageShips.js component re-renders with new ship
   ↓
8. Modal closes and toast shows success message
```

---

## State Management Architecture

### Redux Store Structure

```
{
  ship: {
    ships: [],
    ship: {},
    status: 'idle',
    error: null,
    successMessage: null
  },
  docking: {
    dockings: [],
    docking: {},
    status: 'idle',
    error: null,
    successMessage: null
  },
  repair: {
    repairs: [],
    repair: {},
    repairHistory: [],
    status: 'idle',
    error: null,
    successMessage: null
  },
  workOrder: {
    workOrders: [],
    workOrder: {},
    inventoryOrders: [],
    status: 'idle',
    error: null
  },
  inventory: {
    inventories: [],
    inventory: {},
    status: 'idle',
    error: null,
    successMessage: null
  },
  user: {
    users: [],
    user: {},
    roles: [],
    status: 'idle',
    error: null
  },
  role: {
    roles: [],
    status: 'idle',
    error: null
  },
  shipyard: {
    shipyards: [],
    shipyard: {},
    status: 'idle',
    error: null
  }
}
```

### Async Thunk Pattern

All async operations follow this pattern:

```javascript
export const fetchData = (id) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const data = await apiFunction(id);
    dispatch(requestSuccess(data));
  } catch (error) {
    dispatch(requestFailure(error.message));
    handleError(dispatch, error, fallbackMsg);
  }
};
```

---

## Key Dependencies & Libraries

### Core Framework

- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering
- **react-router-dom** (6.15.0) - Routing and navigation

### State Management

- **@reduxjs/toolkit** (2.6.0) - Redux state management
- **react-redux** (9.2.0) - React-Redux bindings

### UI Framework & Components

- **@mui/material** (5.14.5) - Material Design components
- **@mui/lab** (5.0.0-alpha.140) - Material-UI lab components
- **@mui/base** (5.0.0-beta.11) - Base unstyled components
- **@emotion/react** (11.11.1) - CSS-in-JS styling
- **@emotion/styled** (11.11.0) - Styled components
- **@emotion/cache** (11.11.0) - Emotion cache

### Data & Tables

- **@tanstack/react-table** (8.9.3) - Headless table library
- **@tanstack/match-sorter-utils** (8.8.4) - String matching for filtering

### Charts & Visualization

- **apexcharts** (3.41.1) - Modern charting library
- **react-apexcharts** (1.4.1) - React wrapper for ApexCharts

### Forms & Validation

- **formik** (2.4.3) - Form state management
- **yup** - Schema validation (likely version 0.32+)

### Internationalization

- **react-intl** (6.4.4) - i18n for React

### Date/Time

- **@mui/x-date-pickers** (6.11.1) - Material-UI date pickers
- **dayjs** - Date manipulation library

### HTTP Client

- **axios** (1.4.0) - HTTP client
- **jwt-decode** (3.1.2) - JWT token decoding

### Utilities

- **lodash** (4.17.21) - Utility functions
- **chance** (1.1.11) - Random data generation
- **prop-types** (15.8.1) - Runtime prop validation

### Drag & Drop

- **react-dnd** (16.0.1) - Drag and drop library
- **react-dnd-html5-backend** (16.0.1) - HTML5 backend
- **react-dnd-touch-backend** (16.0.1) - Touch support

### Notifications & UI

- **notistack** (3.0.1) - Snackbar notifications
- **react-toastify** (11.0.5) - Toast notifications
- **react-copy-to-clipboard** (5.1.0) - Copy to clipboard

### Animation

- **framer-motion** (10.16.0) - Animation library

### Other

- **mapbox-gl** (2.15.0) - Map rendering (if maps feature exists)
- **simplebar-react** (3.2.4) - Scrollbar styling
- **react-syntax-highlighter** (15.5.0) - Code highlighting
- **react-device-detect** (2.2.3) - Device detection
- **@react-pdf/renderer** (3.1.12) - PDF generation
- **react-scripts** (5.0.1) - Create React App scripts

---

## User Roles & Permissions

### Role Hierarchy

1. **SUPER_ADMIN**

   - Manage all shipyards
   - Create admin users
   - System-wide configuration
   - Access: All routes

2. **ADMIN**

   - Manage single shipyard
   - Create department managers
   - Oversee all operations
   - Access: Admin dashboard, all management pages

3. **PROJECT_MANAGER**

   - Oversee projects (dockings/repairs)
   - Monitor progress
   - Manage work orders
   - Access: Work orders, repairs, dockings

4. **FOREMAN**

   - Lead department teams
   - Assign work to employees
   - Track daily work
   - Access: Work orders, task assignments

5. **EMPLOYEE**

   - Execute assigned work
   - Update task status
   - Limited data visibility
   - Access: Assigned work orders only

6. **CLIENT**
   - View own ships
   - Monitor repair status
   - Limited administrative features
   - Access: Ship details, repair progress

---

## Authentication Flow

1. **User visits /auth/login**
2. **Enters credentials**
3. **Backend validates and returns JWT token**
4. **Token stored in localStorage as 'serviceToken'**
5. **Token injected in all subsequent API requests**
6. **Token verified via JWTContext**
7. **User redirected to dashboard**
8. **Routes protected by RoleBasedRoutes**
9. **On logout**: Token cleared, user redirected to login

---

## Error Handling

### Error Flow

1. **API Error Occurs**
2. **Caught in Redux action**
3. **dispatch(requestFailure(error))**
4. **Error message shown via toast notification**
5. **Store updated with error state**
6. **Component displays error message to user**

### Toast Notification Types

- **Success**: "Operation completed successfully" (green)
- **Error**: "Something went wrong" (red)
- **Warning**: "Caution required" (orange)
- **Info**: "Informational message" (blue)

---

## Feature Roadmap & Future Enhancements

Potential features for future development:

1. **Advanced Analytics Dashboard**

   - Repair completion rates
   - Cost analysis
   - Resource utilization

2. **Scheduling System**

   - Calendar view of dockings
   - Resource conflict detection
   - Automated scheduling

3. **Document Management**

   - Upload repair reports
   - Certificate management
   - Photo gallery

4. **Communication Module**

   - In-app messaging
   - Notifications system
   - Email alerts

5. **Mobile App**

   - React Native adaptation
   - Offline functionality
   - Mobile-optimized UI

6. **Integration APIs**
   - Third-party integrations
   - Webhook support
   - Data export capabilities

---

## Development Guidelines

### Code Organization

- Keep components small and focused
- Use custom hooks for shared logic
- Maintain separation of concerns
- Follow Material-UI conventions

### Naming Conventions

- Components: PascalCase (e.g., `ManageShips.js`)
- Utilities: camelCase (e.g., `getColors.js`)
- Constants: UPPER_CASE (e.g., `REPAIR_STATUS`)
- Redux slices: camelCase (e.g., `shipSlice`)

### File Structure

- One main component per file
- Related styles/hooks in same directory
- Index files for clean imports
- Descriptive filenames

### Best Practices

- Use TypeScript for type safety (future)
- Implement error boundaries
- Memoize expensive computations
- Use lazy loading for routes
- Optimize re-renders with useMemo/useCallback

---

## Conclusion

The Ship Repair Yard Frontend is a comprehensive, role-based management system built with modern React technologies. It provides complete functionality for managing the complex operations of a ship repair facility, from scheduling dockings to tracking repairs and managing resources. The modular architecture allows for easy maintenance and future feature additions.

For questions or additional documentation, refer to the README.md or codebase comments.
