# e-Hotels Booking System

A collaborative platform for hotel chains that allows customers to book rooms in hotels across North America and enables hotel employees to manage bookings and rentings.

## Features

- **Customer Features:**
  - Search for rooms by multiple criteria (dates, capacity, area, hotel chain, etc.)
  - Book rooms for specific dates
  - View booking history

- **Employee Features:**
  - Check in customers (transform bookings to rentings)
  - Create direct rentings for walk-in customers
  - Manage customer payments

- **Database Views:**
  - Available rooms by area
  - Hotel capacity by room

## Technology Stack

- **Backend:**
  - Node.js with Express
  - PostgreSQL database
  - JWT for authentication

- **Frontend:**
  - HTML, CSS, JavaScript
  - Vanilla JS (no frameworks)

## Prerequisites

- Node.js (version 14 or later)
- PostgreSQL (version 12 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/e-hotels.git
   cd e-hotels
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a PostgreSQL database:
   ```
   createdb ehotels
   ```

4. Create a `.env` file based on `.env.example` and update with your database credentials:
   ```
   cp .env.example .env
   ```

5. Initialize the database schema:
   ```
   psql -U postgres -d ehotels -f schema.sql
   ```

6. Populate the database with sample data:
   ```
   psql -U postgres -d ehotels -f populate_data.sql
   ```

7. Start the application:
   ```
   npm start
   ```

8. Open your browser and navigate to `http://localhost:3002`

## Test Accounts

### Customer Account:
- Email: customer@test.com
- Password: password

### Employee Account:
- Email: employee@test.com
- Password: (any password works for testing)

## Project Structure

- `server.js` - Main application file
- `schema.sql` - Database schema
- `populate_data.sql` - Sample data
- `public/` - Frontend files
  - `index.html` - Main HTML file
  - `app.js` - Frontend JavaScript
  - `styles.css` - Styling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as part of a university database course assignment. 