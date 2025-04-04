-- Hotel Chain Management System Database Schema

-- Enable UUID extension
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
    password VARCHAR(255) NOT NULL,  -- Added password column
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

-- Archive table for historical data
CREATE TABLE archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type VARCHAR(20) NOT NULL,
    record_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    room_id UUID NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_hotel_chain_name ON hotel_chain(name);
CREATE INDEX idx_hotel_location ON hotel USING GIST (to_tsvector('english', address));
CREATE INDEX idx_room_availability ON room(status, hotel_id);
CREATE INDEX idx_booking_dates ON booking(check_in_date, check_out_date);

-- Views
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

-- Triggers
CREATE OR REPLACE FUNCTION update_hotel_room_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hotel SET number_of_rooms = number_of_rooms + 1
        WHERE id = NEW.hotel_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hotel SET number_of_rooms = number_of_rooms - 1
        WHERE id = OLD.hotel_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_count_trigger
AFTER INSERT OR DELETE ON room
FOR EACH ROW
EXECUTE FUNCTION update_hotel_room_count();

CREATE OR REPLACE FUNCTION update_chain_hotel_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hotel_chain SET number_of_hotels = number_of_hotels + 1
        WHERE id = NEW.chain_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hotel_chain SET number_of_hotels = number_of_hotels - 1
        WHERE id = OLD.chain_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotel_count_trigger
AFTER INSERT OR DELETE ON hotel
FOR EACH ROW
EXECUTE FUNCTION update_chain_hotel_count();
