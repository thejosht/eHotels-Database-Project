const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const {
            fullName,
            address,
            idType,
            idNumber,
            email,
            phone,
            password,
            isEmployee,
            hotelId,
            position,
            isManager
        } = req.body;

        // Validate required fields
        if (!fullName || !address || !idType || !idNumber || !email || !phone || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Validate ID type
        const validIdTypes = ['SSN', 'SIN', 'DL'];
        if (!validIdTypes.includes(idType)) {
            return res.status(400).json({ error: 'Invalid ID type' });
        }

        // Check if email already exists
        const emailCheck = await pool.query('SELECT id FROM customer WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if ID combination already exists
        const idCheck = await pool.query(
            'SELECT id FROM customer WHERE id_type = $1 AND id_number = $2',
            [idType, idNumber]
        );
        if (idCheck.rows.length > 0) {
            return res.status(400).json({ error: 'ID number already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start transaction
        await pool.query('BEGIN');

        // Insert customer
        const customerResult = await pool.query(
            `INSERT INTO customer 
            (full_name, address, id_type, id_number, email, phone, password) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id`,
            [fullName, address, idType, idNumber, email, phone, hashedPassword]
        );

        const customerId = customerResult.rows[0].id;

        // If registering as employee, insert employee record
        if (isEmployee) {
            if (!hotelId || !position) {
                await pool.query('ROLLBACK');
                return res.status(400).json({ error: 'Hotel ID and position are required for employee registration' });
            }

            await pool.query(
                `INSERT INTO employee 
                (hotel_id, full_name, address, ssn, role, is_manager, email, phone) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [hotelId, fullName, address, idNumber, position, isManager, email, phone]
            );
        }

        await pool.query('COMMIT');

        // Generate JWT token
        const token = jwt.sign(
            { id: customerId, role: isEmployee ? 'employee' : 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, userType: isEmployee ? 'employee' : 'customer' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error in registration:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, isEmployee } = req.body;
        
        let query, result;
        
        // For testing purposes
        const testMode = process.env.NODE_ENV !== 'production';
        
        if (isEmployee) {
            query = 'SELECT * FROM employee WHERE email = $1';
            result = await pool.query(query, [email]);
            
            if (result.rows.length > 0) {
                const employee = result.rows[0];
                
                // For demo purposes, allow any employee to log in without password check
                // In a real application, you'd hash and verify passwords
                const token = jwt.sign({ 
                    id: employee.id, 
                    email: employee.email, 
                    role: 'employee',
                    isManager: employee.is_manager 
                }, process.env.JWT_SECRET);
                
                return res.json({ token, userType: 'employee' });
            } else if (testMode && email === 'employee@test.com') {
                // Test employee account
                const testEmployeeQuery = 'SELECT * FROM employee LIMIT 1';
                const testEmployeeResult = await pool.query(testEmployeeQuery);
                
                if (testEmployeeResult.rows.length > 0) {
                    const employee = testEmployeeResult.rows[0];
                    const token = jwt.sign({ 
                        id: employee.id, 
                        email: employee.email, 
                        role: 'employee',
                        isManager: employee.is_manager 
                    }, process.env.JWT_SECRET);
                    
                    return res.json({ token, userType: 'employee' });
                }
            }
            
            return res.status(401).json({ error: 'Invalid employee credentials' });
        } else {
            // Existing customer login logic
            query = 'SELECT * FROM customer WHERE email = $1';
            result = await pool.query(query, [email]);
            
            const user = result.rows[0];
            
            if (user) {
                // Test if password matches or allow test@test.com with password 'password' for testing
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (isValidPassword || (testMode && email === 'customer@test.com' && password === 'password')) {
                    const token = jwt.sign({ 
                        id: user.id, 
                        email: user.email,
                        role: 'customer' 
                    }, process.env.JWT_SECRET);
                    
                    return res.json({ token, userType: 'customer' });
                }
            } else if (testMode && email === 'customer@test.com' && password === 'password') {
                // If test account doesn't exist yet, get any customer for testing
                const testCustomerQuery = 'SELECT * FROM customer LIMIT 1';
                const testCustomerResult = await pool.query(testCustomerQuery);
                
                if (testCustomerResult.rows.length > 0) {
                    const customer = testCustomerResult.rows[0];
                    const token = jwt.sign({ 
                        id: customer.id, 
                        email: customer.email,
                        role: 'customer' 
                    }, process.env.JWT_SECRET);
                    
                    return res.json({ token, userType: 'customer' });
                }
            }
            
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Token verification route
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ 
        id: req.user.id, 
        email: req.user.email,
        userType: req.user.role,
        isManager: req.user.isManager
    });
});

// Hotel routes
app.get('/api/hotels', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.*, hc.name as chain_name 
            FROM hotel h
            JOIN hotel_chain hc ON h.chain_id = hc.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all hotel chains
app.get('/api/hotel-chains', async (req, res) => {
    try {
        // Set headers to prevent caching
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Expires', '0');
        res.set('Pragma', 'no-cache');
        
        console.log('Fetching hotel chains from database...');
        const result = await pool.query('SELECT * FROM hotel_chain ORDER BY name');
        console.log('Query result:', result.rows);
        
        if (!result.rows || result.rows.length === 0) {
            console.log('No hotel chains found in database');
            return res.json([]);
        }
        
        console.log(`Found ${result.rows.length} hotel chains`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching hotel chains:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Get hotels by chain
app.get('/api/hotel-chains/:chainId/hotels', async (req, res) => {
    try {
        const { chainId } = req.params;
        const result = await pool.query(
            'SELECT * FROM hotel WHERE chain_id = $1 ORDER BY name',
            [chainId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching hotels by chain:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Room routes
app.get('/api/rooms/available', async (req, res) => {
    try {
        const {
            checkIn,
            checkOut,
            capacity,
            area,
            chainId,
            category,
            maxPrice,
            minPrice,
            seaView,
            mountainView,
            extendable
        } = req.query;

        console.log('Raw search parameters:', req.query);

        // Validate required parameters
        if (!checkIn || !checkOut || !area) {
            return res.status(400).json({ 
                error: 'Missing required parameters',
                required: ['checkIn', 'checkOut', 'area'],
                received: req.query
            });
        }

        // Format dates properly for PostgreSQL
        let formattedCheckIn, formattedCheckOut;
        try {
            formattedCheckIn = new Date(checkIn).toISOString().split('T')[0];
            formattedCheckOut = new Date(checkOut).toISOString().split('T')[0];
            
            if (!formattedCheckIn || !formattedCheckOut) {
                throw new Error('Invalid date format');
            }

            console.log('Formatted dates:', { formattedCheckIn, formattedCheckOut });
        } catch (dateError) {
            console.error('Date formatting error:', dateError);
            return res.status(400).json({ 
                error: 'Invalid date format',
                details: dateError.message,
                received: { checkIn, checkOut }
            });
        }

        let query = `
            SELECT DISTINCT
                r.*,
                h.name as hotel_name,
                h.address as hotel_address,
                h.category as hotel_category,
                hc.name as chain_name
            FROM room r
            JOIN hotel h ON r.hotel_id = h.id
            JOIN hotel_chain hc ON h.chain_id = hc.id
            WHERE NOT EXISTS (
                SELECT 1 FROM booking b
                WHERE b.room_id = r.id
                AND b.status = 'pending'
                AND (
                    (b.check_in_date <= $1 AND b.check_out_date > $1)
                    OR (b.check_in_date < $2 AND b.check_out_date >= $2)
                    OR (b.check_in_date >= $1 AND b.check_out_date <= $2)
                )
            )
            AND NOT EXISTS (
                SELECT 1 FROM renting rn
                WHERE rn.room_id = r.id
                AND (
                    (rn.check_in_date <= $1 AND rn.check_out_date > $1)
                    OR (rn.check_in_date < $2 AND rn.check_out_date >= $2)
                    OR (rn.check_in_date >= $1 AND rn.check_out_date <= $2)
                )
            )
        `;

        const queryParams = [formattedCheckIn, formattedCheckOut];
        let paramCount = 3;

        if (area) {
            query += ` AND h.address ILIKE $${paramCount}`;
            queryParams.push(`%${area}%`);
            paramCount++;
        }

        if (chainId) {
            query += ` AND h.chain_id = $${paramCount}`;
            queryParams.push(chainId);
            paramCount++;
        }

        if (category) {
            query += ` AND h.category = $${paramCount}`;
            queryParams.push(parseInt(category, 10));
            paramCount++;
        }

        if (capacity) {
            query += ` AND r.capacity = $${paramCount}`;
            queryParams.push(capacity);
            paramCount++;
        }

        if (minPrice) {
            query += ` AND r.price >= $${paramCount}`;
            queryParams.push(parseFloat(minPrice));
            paramCount++;
        }

        if (maxPrice) {
            query += ` AND r.price <= $${paramCount}`;
            queryParams.push(parseFloat(maxPrice));
            paramCount++;
        }

        if (seaView === 'true') {
            query += ` AND r.sea_view = true`;
        }

        if (mountainView === 'true') {
            query += ` AND r.mountain_view = true`;
        }

        if (extendable === 'true') {
            query += ` AND r.extendable = true`;
        }

        query += ` ORDER BY r.price ASC`;

        console.log('Final SQL query:', query);
        console.log('Query parameters:', queryParams);

        const result = await pool.query(query, queryParams);
        console.log(`Query returned ${result.rows.length} results`);
        
        if (result.rows.length === 0) {
            console.log('No rooms found. Running debug queries...');
            
            const matchingAreas = await pool.query(
                "SELECT DISTINCT h.name, h.address FROM hotel h WHERE h.address ILIKE $1",
                [`%${area}%`]
            );
            console.log('Hotels matching area search:', matchingAreas.rows);
        }
        
        // Include query information in the response
        res.json({
            results: result.rows,
            debug: {
                query: query,
                parameters: queryParams,
                matchingHotels: result.rows.length > 0 
                    ? [...new Set(result.rows.map(r => r.hotel_name))]
                    : []
            }
        });
    } catch (error) {
        console.error('Error searching rooms:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Booking routes
app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;
        const customerId = req.user.id;
        
        const result = await pool.query(
            'INSERT INTO booking (customer_id, room_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4) RETURNING id',
            [customerId, roomId, checkIn, checkOut]
        );
        
        res.status(201).json({ bookingId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const customerId = req.user.id;
        
        const bookingsQuery = `
            SELECT b.*, r.room_number, r.price, h.name as hotel_name, h.address as hotel_address
            FROM booking b
            JOIN room r ON b.room_id = r.id
            JOIN hotel h ON r.hotel_id = h.id
            WHERE b.customer_id = $1
            ORDER BY b.created_at DESC
        `;
        
        const result = await pool.query(bookingsQuery, [customerId]);
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employee routes for handling rentings
app.get('/api/employee/bookings', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        // Get employee hotel ID
        const employeeQuery = 'SELECT hotel_id FROM employee WHERE id = $1';
        const employeeResult = await pool.query(employeeQuery, [req.user.id]);
        
        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const hotelId = employeeResult.rows[0].hotel_id;
        
        // Get bookings for this hotel
        const bookingsQuery = `
            SELECT 
                b.*, 
                c.full_name as customer_name, 
                c.id as customer_id, 
                r.room_number, 
                r.price, 
                h.name as hotel_name,
                r.id as room_id
            FROM booking b
            JOIN customer c ON b.customer_id = c.id
            JOIN room r ON b.room_id = r.id
            JOIN hotel h ON r.hotel_id = h.id
            WHERE r.hotel_id = $1 
            AND b.status = 'pending'
            AND b.check_in_date >= CURRENT_DATE
            ORDER BY b.check_in_date ASC
        `;
        
        const result = await pool.query(bookingsQuery, [hotelId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching employee bookings:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/rentings', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { bookingId, customerId, roomId, checkIn, checkOut, paymentAmount, paymentStatus } = req.body;
        const employeeId = req.user.id;
        
        // Start a transaction
        await pool.query('BEGIN');
        
        // Create the renting record
        const rentingResult = await pool.query(
            `INSERT INTO renting 
             (booking_id, customer_id, room_id, employee_id, check_in_date, check_out_date, payment_amount, payment_status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id`,
            [bookingId || null, customerId, roomId, employeeId, checkIn, checkOut, paymentAmount, paymentStatus || 'pending']
        );
        
        // If this is from a booking, update the booking status
        if (bookingId) {
            await pool.query(
                'UPDATE booking SET status = $1 WHERE id = $2',
                ['completed', bookingId]
            );
        }
        
        // Update room status to occupied
        await pool.query(
            'UPDATE room SET status = $1 WHERE id = $2',
            ['occupied', roomId]
        );
        
        await pool.query('COMMIT');
        
        res.status(201).json({ 
            rentingId: rentingResult.rows[0].id,
            message: 'Renting created successfully' 
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

// Direct room renting (walk-in customers)
app.post('/api/direct-renting', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { customerId, roomId, checkIn, checkOut, paymentAmount } = req.body;
        const employeeId = req.user.id;
        
        // Start transaction
        await pool.query('BEGIN');
        
        // Create renting record without booking_id
        const result = await pool.query(
            `INSERT INTO renting 
             (customer_id, room_id, employee_id, check_in_date, check_out_date, payment_amount) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id`,
            [customerId, roomId, employeeId, checkIn, checkOut, paymentAmount]
        );
        
        // Update room status
        await pool.query(
            'UPDATE room SET status = $1 WHERE id = $2',
            ['occupied', roomId]
        );
        
        await pool.query('COMMIT');
        
        res.status(201).json({ 
            rentingId: result.rows[0].id,
            message: 'Direct renting created successfully' 
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

// Get available customers for employee operations
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const result = await pool.query('SELECT id, full_name, email FROM customer');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get available rooms for direct renting
app.get('/api/employee/available-rooms', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        // Get employee hotel ID
        const employeeQuery = 'SELECT hotel_id FROM employee WHERE id = $1';
        const employeeResult = await pool.query(employeeQuery, [req.user.id]);
        
        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const hotelId = employeeResult.rows[0].hotel_id;
        
        // Get available rooms for this hotel
        const roomsQuery = `
            SELECT id, room_number, price, capacity, amenities
            FROM room
            WHERE hotel_id = $1 AND status = 'available'
            ORDER BY room_number
        `;
        
        const result = await pool.query(roomsQuery, [hotelId]);
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Views routes
app.get('/api/views/available-rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM available_rooms_by_area');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/views/hotel-capacity', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hotel_capacity');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        const customerId = req.user.id;
        
        // Verify the booking belongs to the customer
        const bookingQuery = `
            SELECT b.*, r.hotel_id
            FROM booking b
            JOIN room r ON b.room_id = r.id
            WHERE b.id = $1 AND b.customer_id = $2
        `;
        
        const bookingResult = await pool.query(bookingQuery, [bookingId, customerId]);
        
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found or unauthorized' });
        }
        
        const booking = bookingResult.rows[0];
        
        // Check if the booking can be cancelled (e.g., not already cancelled or completed)
        if (booking.status !== 'pending') {
            return res.status(400).json({ error: 'This booking cannot be cancelled' });
        }
        
        // Start a transaction
        await pool.query('BEGIN');
        
        // Update booking status to cancelled
        await pool.query(
            'UPDATE booking SET status = $1 WHERE id = $2',
            ['cancelled', bookingId]
        );
        
        // Update room status back to available
        await pool.query(
            'UPDATE room SET status = $1 WHERE id = $2',
            ['available', booking.room_id]
        );
        
        await pool.query('COMMIT');
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: err.message });
    }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        console.log('Testing database connection...');
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', result.rows[0]);
        res.json({ success: true, timestamp: result.rows[0].now });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed: ' + error.message });
    }
});

// Check and initialize database
async function checkAndInitializeDatabase() {
    try {
        console.log('Checking database initialization...');
        
        // Check if hotel_chain table exists and has data
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT 1 FROM hotel_chain LIMIT 1
            );
        `);
        
        const hasData = tableCheck.rows[0].exists;
        console.log('Database has hotel chain data:', hasData);
        
        if (!hasData) {
            console.log('Database needs initialization. Running initialization scripts...');
            await initializeDatabase();
        } else {
            // Verify the data is correct
            const chainCheck = await pool.query('SELECT name FROM hotel_chain LIMIT 5');
            console.log('Current hotel chains:', chainCheck.rows.map(row => row.name));
            
            // If we see "Chain A" instead of real names, reinitialize
            if (chainCheck.rows.some(row => row.name.includes('Chain'))) {
                console.log('Found placeholder data. Reinitializing database...');
                await initializeDatabase();
            } else {
                console.log('Database already initialized with correct data.');
            }
        }
    } catch (error) {
        console.error('Database initialization check failed:', error);
        throw error;
    }
}

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        // Drop all tables first
        console.log('Dropping existing tables...');
        await pool.query(`
            DROP TABLE IF EXISTS renting CASCADE;
            DROP TABLE IF EXISTS booking CASCADE;
            DROP TABLE IF EXISTS employee CASCADE;
            DROP TABLE IF EXISTS customer CASCADE;
            DROP TABLE IF EXISTS room CASCADE;
            DROP TABLE IF EXISTS hotel CASCADE;
            DROP TABLE IF EXISTS hotel_chain CASCADE;
            DROP TABLE IF EXISTS archive CASCADE;
        `);
        console.log('Existing tables dropped successfully');
        
        // Read and execute schema.sql
        console.log('Running schema.sql...');
        const schemaSQL = fs.readFileSync('schema.sql', 'utf8');
        await pool.query(schemaSQL);
        console.log('Schema created successfully');
        
        // Read and execute populate_data.sql
        console.log('Running populate_data.sql...');
        const populateSQL = fs.readFileSync('populate_data.sql', 'utf8');
        await pool.query(populateSQL);
        console.log('Data populated successfully');
        
        // Verify data was populated
        const verifyChains = await pool.query('SELECT COUNT(*) FROM hotel_chain');
        const verifyHotels = await pool.query('SELECT COUNT(*) FROM hotel');
        const verifyRooms = await pool.query('SELECT COUNT(*) FROM room');
        
        console.log('Verification counts:');
        console.log('- Hotel Chains:', verifyChains.rows[0].count);
        console.log('- Hotels:', verifyHotels.rows[0].count);
        console.log('- Rooms:', verifyRooms.rows[0].count);
        
        if (verifyChains.rows[0].count === 0) {
            throw new Error('Hotel chains were not populated correctly');
        }
        
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Start the server
const PORT = process.env.PORT || 3002;

// Initialize database and start server
async function startServer() {
    try {
        await checkAndInitializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();