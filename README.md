# e-Hotels Booking System

A collaborative platform for hotel chains that allows customers to book rooms in hotels across North America and enables hotel employees to manage bookings and rentings.

## Features

- **Customer Features:**
  - Search for rooms by multiple criteria (dates, capacity, area, hotel chain, etc.)
  - Book rooms for specific dates
  - View booking history and status

- **Employee Features:**
  - Check in customers (transform bookings to rentings)
  - Create direct rentings for walk-in customers
  - Manage customer payments

- **Database Views:**
  - Available rooms by area
  - Hotel capacity by room

## Project Report

### A. Technology Stack

- **Database Management System (DBMS):**
  - PostgreSQL 12+ - A powerful, open-source object-relational database system with strong reputation for reliability, feature robustness, and performance.

- **Programming Languages:**
  - **Backend:** Node.js (JavaScript runtime) with Express framework
  - **Frontend:** HTML5, CSS3, JavaScript (ES6+)
  - **Database Query Language:** SQL (with PostgreSQL-specific extensions)

- **Libraries/Frameworks:**
  - Express.js - Web application framework for handling routes and HTTP requests
  - pg (node-postgres) - PostgreSQL client for Node.js
  - bcryptjs - Password hashing library for secure authentication
  - jsonwebtoken - JSON Web Token implementation for secure API authentication
  - dotenv - Environment variable management
  - CORS - Cross-Origin Resource Sharing middleware

### B. Installation Guide

1. **Prerequisites:**
   - Node.js (v14 or later)
   - PostgreSQL (v12 or later)
   - Git

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/thejosht/eHotels-Database-Project.git
   cd eHotels-Database-Project
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Database Setup:**
   - Create a PostgreSQL database:
     ```bash
     createdb ehotels
     ```
   - Initialize database schema:
     ```bash
     psql -d ehotels -f schema.sql
     ```
   - Populate with sample data:
     ```bash
     psql -d ehotels -f populate_data.sql
     ```

5. **Environment Configuration:**
   - Create a `.env` file with the following content (adjust as needed):
     ```
     DB_USER=postgres
     DB_HOST=localhost
     DB_NAME=ehotels
     DB_PASSWORD=postgres
     DB_PORT=5432
     PORT=3003
     JWT_SECRET=your_jwt_secret_key_here
     ```

6. **Start the Application:**
   ```bash
   npm start
   ```

7. **Access the Application:**
   - Open your browser and navigate to `http://localhost:3003`

8. **Test Accounts:**
   - **Customer:** 
     - Email: customer@test.com
     - Password: password123
   - **Employee:** 
     - Email: manager@ehotels.com
     - Password: password123

### C. Database DDL Statements

The database schema is defined in `schema.sql` and includes the following key DDL statements:

```sql
-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hotel Chain table
CREATE TABLE hotel_chain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    central_office_address TEXT NOT NULL,
    number_of_hotels INTEGER NOT NULL DEFAULT 0,
    email VARCHAR(255)[] NOT NULL,
    phone_numbers VARCHAR(20)[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel table
CREATE TABLE hotel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id UUID NOT NULL REFERENCES hotel_chain(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category INTEGER CHECK (category BETWEEN 1 AND 5),
    address TEXT NOT NULL,
    email VARCHAR(255)[] NOT NULL,
    phone_numbers VARCHAR(20)[] NOT NULL,
    number_of_rooms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Room table
CREATE TABLE room (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
    room_number VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    capacity VARCHAR(20) NOT NULL,
    amenities TEXT[] NOT NULL,
    sea_view BOOLEAN DEFAULT FALSE,
    mountain_view BOOLEAN DEFAULT FALSE,
    extendable BOOLEAN DEFAULT FALSE,
    damages TEXT,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hotel_id, room_number)
);

-- Customer table
CREATE TABLE customer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    id_type VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_type, id_number)
);

-- Employee table
CREATE TABLE employee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    ssn VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_manager BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Booking table
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customer(id),
    room_id UUID NOT NULL REFERENCES room(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out_date > check_in_date)
);

-- Renting table
CREATE TABLE renting (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES booking(id),
    customer_id UUID NOT NULL REFERENCES customer(id),
    room_id UUID NOT NULL REFERENCES room(id),
    employee_id UUID NOT NULL REFERENCES employee(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out_date > check_in_date)
);

-- Database Views for Analysis
CREATE VIEW available_rooms_by_area AS
SELECT 
    h.address,
    COUNT(r.id) as available_rooms
FROM hotel h
JOIN room r ON h.id = r.hotel_id
WHERE r.status = 'available'
GROUP BY h.address;

CREATE VIEW hotel_capacity AS
SELECT 
    h.name as hotel_name,
    SUM(CASE 
        WHEN r.capacity = 'single' THEN 1
        WHEN r.capacity = 'double' THEN 2
        WHEN r.capacity = 'triple' THEN 3
        WHEN r.capacity = 'quad' THEN 4
        ELSE 0
    END) as total_capacity
FROM hotel h
JOIN room r ON h.id = r.hotel_id
GROUP BY h.name;
```

## Project Structure

- `server.js` - Main application file with API endpoints
- `schema.sql` - Database schema definition
- `populate_data.sql` - Sample data population
- `public/` - Frontend files
  - `index.html` - Main HTML file
  - `app.js` - Frontend JavaScript with UI logic
  - `styles.css` - CSS styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as part of a university database course assignment. 