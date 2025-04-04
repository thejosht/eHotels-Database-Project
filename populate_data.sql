-- Sample Data for e-Hotels Database

-- Insert Hotel Chains
INSERT INTO hotel_chain (name, central_office_address, number_of_hotels, email, phone_numbers) VALUES
('Chain A', '123 Chain A St, City A', 3, ARRAY['contact@chainA.com'], ARRAY['123-456-7890']),
('Chain B', '456 Chain B St, City B', 2, ARRAY['contact@chainB.com'], ARRAY['234-567-8901']),
('Chain C', '789 Chain C St, City C', 4, ARRAY['contact@chainC.com'], ARRAY['345-678-9012']),
('Chain D', '101 Chain D St, City D', 5, ARRAY['contact@chainD.com'], ARRAY['456-789-0123']),
('Chain E', '202 Chain E St, City E', 1, ARRAY['contact@chainE.com'], ARRAY['567-890-1234']);

-- Insert Hotels
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'Chain A'), 'Hotel A1', 3, '1 Hotel A St, City A', ARRAY['hotelA1@chainA.com'], ARRAY['123-456-7891']),
((SELECT id FROM hotel_chain WHERE name = 'Chain A'), 'Hotel A2', 4, '2 Hotel A St, City A', ARRAY['hotelA2@chainA.com'], ARRAY['123-456-7892']),
((SELECT id FROM hotel_chain WHERE name = 'Chain B'), 'Hotel B1', 2, '1 Hotel B St, City B', ARRAY['hotelB1@chainB.com'], ARRAY['234-567-8902']),
((SELECT id FROM hotel_chain WHERE name = 'Chain C'), 'Hotel C1', 5, '1 Hotel C St, City C', ARRAY['hotelC1@chainC.com'], ARRAY['345-678-8903']),
((SELECT id FROM hotel_chain WHERE name = 'Chain C'), 'Hotel C2', 1, '2 Hotel C St, City C', ARRAY['hotelC2@chainC.com'], ARRAY['345-678-8904']),
((SELECT id FROM hotel_chain WHERE name = 'Chain D'), 'Hotel D1', 3, '1 Hotel D St, City D', ARRAY['hotelD1@chainD.com'], ARRAY['456-789-8905']),
((SELECT id FROM hotel_chain WHERE name = 'Chain E'), 'Hotel E1', 2, '1 Hotel E St, City E', ARRAY['hotelE1@chainE.com'], ARRAY['567-890-8906']);

-- Insert Rooms
INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable) VALUES
((SELECT id FROM hotel WHERE name = 'Hotel A1'), '101', 150.00, 'double', ARRAY['TV', 'WiFi'], TRUE, FALSE, TRUE),
((SELECT id FROM hotel WHERE name = 'Hotel A1'), '102', 120.00, 'single', ARRAY['TV', 'WiFi'], FALSE, TRUE, FALSE),
((SELECT id FROM hotel WHERE name = 'Hotel A2'), '201', 200.00, 'double', ARRAY['TV', 'AC'], TRUE, FALSE, TRUE),
((SELECT id FROM hotel WHERE name = 'Hotel B1'), '301', 180.00, 'double', ARRAY['TV', 'WiFi', 'Fridge'], FALSE, TRUE, TRUE),
((SELECT id FROM hotel WHERE name = 'Hotel C1'), '401', 220.00, 'triple', ARRAY['TV', 'WiFi', 'AC'], TRUE, TRUE, TRUE),
((SELECT id FROM hotel WHERE name = 'Hotel C2'), '402', 160.00, 'double', ARRAY['TV', 'WiFi'], FALSE, FALSE, FALSE),
((SELECT id FROM hotel WHERE name = 'Hotel D1'), '501', 140.00, 'single', ARRAY['TV'], TRUE, FALSE, FALSE),
((SELECT id FROM hotel WHERE name = 'Hotel E1'), '601', 130.00, 'single', ARRAY['WiFi'], FALSE, TRUE, FALSE);

-- Add employee data
INSERT INTO employee (hotel_id, full_name, address, ssn, role, is_manager, email, phone) 
SELECT 
    h.id,
    'John Manager', 
    '123 Manager St, New York, NY', 
    '123-45-6789', 
    'Manager', 
    TRUE, 
    'manager@ehotels.com', 
    '555-123-4567'
FROM hotel h
LIMIT 1;

INSERT INTO employee (hotel_id, full_name, address, ssn, role, is_manager, email, phone) 
SELECT 
    h.id, 
    'Jane Receptionist', 
    '456 Staff Ave, New York, NY', 
    '987-65-4321', 
    'Receptionist', 
    FALSE, 
    'receptionist@ehotels.com', 
    '555-987-6543'
FROM hotel h
LIMIT 1;

-- Add more employees for different hotels
INSERT INTO employee (hotel_id, full_name, address, ssn, role, is_manager, email, phone)
SELECT 
    h.id,
    'Emily Staff', 
    '789 Employee Blvd, Chicago, IL', 
    '555-66-7777', 
    'Staff', 
    FALSE, 
    'staff@ehotels.com', 
    '555-555-5555'
FROM hotel h
OFFSET 1
LIMIT 1;

-- Add test customer
INSERT INTO customer (full_name, address, id_type, id_number, email, phone, password)
VALUES (
    'Test Customer',
    '123 Test St, New York, NY',
    'SSN',
    '123-45-6789',
    'customer@test.com',
    '555-123-4567',
    '$2a$10$9QxzrVJnN5kkCLtLl4Sz1uHAlJw0UgyXb5RjAXC0Kwd7pK5Kro8dS' -- password: password123
);
