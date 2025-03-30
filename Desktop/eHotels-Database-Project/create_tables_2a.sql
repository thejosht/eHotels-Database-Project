CREATE TABLE HotelChain (
    chain_id      SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    address       VARCHAR(200) NOT NULL,
    phone_number  VARCHAR(15),
    email         VARCHAR(100)
);

CREATE TABLE Hotel (
    hotel_id     SERIAL PRIMARY KEY,
    chain_id     INT NOT NULL,
    address      VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15),
    email        VARCHAR(100),
    category     INT,  -- 1..5
    CONSTRAINT fk_hotel_chain
       FOREIGN KEY (chain_id)
       REFERENCES HotelChain(chain_id)
       ON DELETE CASCADE
);

CREATE TABLE Room (
    room_id       SERIAL PRIMARY KEY,
    hotel_id      INT NOT NULL,
    price         DECIMAL(8,2) NOT NULL,
    capacity      VARCHAR(20),  -- e.g. 'Single', 'Double', ...
    sea_view      BOOLEAN,
    mountain_view BOOLEAN,
    extendable    BOOLEAN,
    damage_desc   TEXT,
    CONSTRAINT fk_room_hotel
       FOREIGN KEY (hotel_id)
       REFERENCES Hotel(hotel_id)
       ON DELETE CASCADE
);

CREATE TABLE Customer (
    customer_id   SERIAL PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    address       VARCHAR(200),
    id_type       VARCHAR(50),
    registration_date DATE
);

CREATE TABLE Employee (
    employee_id   SERIAL PRIMARY KEY,
    hotel_id      INT NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    address       VARCHAR(200),
    sin           VARCHAR(20),
    role          VARCHAR(50),
    CONSTRAINT fk_employee_hotel
       FOREIGN KEY (hotel_id)
       REFERENCES Hotel(hotel_id)
       ON DELETE CASCADE
);

CREATE TABLE Booking (
    booking_id   SERIAL PRIMARY KEY,
    customer_id  INT NOT NULL,
    room_id      INT NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE NOT NULL,
    CONSTRAINT fk_booking_customer
       FOREIGN KEY (customer_id)
       REFERENCES Customer(customer_id)
       ON DELETE CASCADE, 
    CONSTRAINT fk_booking_room
       FOREIGN KEY (room_id)
       REFERENCES Room(room_id)
       ON DELETE CASCADE
);

CREATE TABLE Renting (
    renting_id       SERIAL PRIMARY KEY,
    booking_id       INT NULL,  
    customer_id      INT NOT NULL,
    room_id          INT NOT NULL,
    employee_id      INT NOT NULL,
    check_in_date    DATE NOT NULL,
    check_out_date   DATE NOT NULL,
    payment_amount   DECIMAL(8,2),
    CONSTRAINT fk_renting_customer
       FOREIGN KEY (customer_id)
       REFERENCES Customer(customer_id)
       ON DELETE CASCADE,  
    CONSTRAINT fk_renting_room
       FOREIGN KEY (room_id)
       REFERENCES Room(room_id)
       ON DELETE CASCADE,
    CONSTRAINT fk_renting_employee
       FOREIGN KEY (employee_id)
       REFERENCES Employee(employee_id)
       ON DELETE SET NULL,
    CONSTRAINT fk_renting_booking
       FOREIGN KEY (booking_id)
       REFERENCES Booking(booking_id)
       ON DELETE SET NULL
);
--Index 1: For quick search of available rooms by capacity and price
CREATE INDEX idx_rooms_capacity_price ON rooms(capacity, price);

-- Index 2: For efficient lookup of bookings by start and end date
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

-- Index 3: For employee role-based filtering in hotels
CREATE INDEX idx_employees_role_hotel ON employees(role, hotel_id);