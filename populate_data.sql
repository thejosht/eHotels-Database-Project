-- Sample Data for e-Hotels Database

-- Insert Hotel Chains
INSERT INTO hotel_chain (name, central_office_address, number_of_hotels, email, phone_numbers) VALUES
('Marriott International', '10400 Fernwood Road, Bethesda, MD', 8, ARRAY['contact@marriott.com'], ARRAY['301-380-3000']),
('Hilton Worldwide', '7930 Jones Branch Drive, McLean, VA', 8, ARRAY['contact@hilton.com'], ARRAY['703-883-1000']),
('InterContinental Hotels Group', '3 Ravinia Drive, Atlanta, GA', 8, ARRAY['contact@ihg.com'], ARRAY['770-604-2000']),
('Hyatt Hotels Corporation', '150 North Riverside Plaza, Chicago, IL', 8, ARRAY['contact@hyatt.com'], ARRAY['312-750-1234']),
('Wyndham Hotels & Resorts', '22 Sylvan Way, Parsippany, NJ', 8, ARRAY['contact@wyndham.com'], ARRAY['973-753-6000']);

-- Insert Hotels for Marriott
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott New York Downtown', 4, '85 West Street, New York, NY', ARRAY['nyc@marriott.com'], ARRAY['212-385-4900']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Chicago Downtown', 4, '540 North Michigan Avenue, Chicago, IL', ARRAY['chicago@marriott.com'], ARRAY['312-836-0100']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Los Angeles Downtown', 4, '333 South Figueroa Street, Los Angeles, CA', ARRAY['la@marriott.com'], ARRAY['213-617-1133']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Miami Downtown', 4, '1633 North Bayshore Drive, Miami, FL', ARRAY['miami@marriott.com'], ARRAY['305-374-3900']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Boston Downtown', 4, '110 Huntington Avenue, Boston, MA', ARRAY['boston@marriott.com'], ARRAY['617-236-5800']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott San Francisco Downtown', 4, '55 Fourth Street, San Francisco, CA', ARRAY['sf@marriott.com'], ARRAY['415-896-1600']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Seattle Downtown', 4, '1601 Westlake Avenue, Seattle, WA', ARRAY['seattle@marriott.com'], ARRAY['206-443-5000']),
((SELECT id FROM hotel_chain WHERE name = 'Marriott International'), 'Marriott Toronto Downtown', 4, '525 Bay Street, Toronto, ON', ARRAY['toronto@marriott.com'], ARRAY['416-597-9200']);

-- Insert Hotels for Hilton
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton New York Midtown', 4, '1335 Avenue of the Americas, New York, NY', ARRAY['nyc@hilton.com'], ARRAY['212-586-7000']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Chicago Downtown', 4, '720 South Michigan Avenue, Chicago, IL', ARRAY['chicago@hilton.com'], ARRAY['312-922-4400']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Los Angeles Downtown', 4, '555 South Grand Avenue, Los Angeles, CA', ARRAY['la@hilton.com'], ARRAY['213-624-1000']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Miami Downtown', 4, '1601 Biscayne Boulevard, Miami, FL', ARRAY['miami@hilton.com'], ARRAY['305-374-0000']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Boston Downtown', 4, '89 Broad Street, Boston, MA', ARRAY['boston@hilton.com'], ARRAY['617-556-0006']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton San Francisco Downtown', 4, '333 O''Farrell Street, San Francisco, CA', ARRAY['sf@hilton.com'], ARRAY['415-771-1400']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Seattle Downtown', 4, '1301 6th Avenue, Seattle, WA', ARRAY['seattle@hilton.com'], ARRAY['206-624-0500']),
((SELECT id FROM hotel_chain WHERE name = 'Hilton Worldwide'), 'Hilton Toronto Downtown', 4, '145 Richmond Street West, Toronto, ON', ARRAY['toronto@hilton.com'], ARRAY['416-869-3456']);

-- Insert Hotels for IHG
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental New York Times Square', 5, '300 West 44th Street, New York, NY', ARRAY['nyc@ihg.com'], ARRAY['212-803-4500']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Chicago Magnificent Mile', 5, '505 North Michigan Avenue, Chicago, IL', ARRAY['chicago@ihg.com'], ARRAY['312-944-4100']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Los Angeles Downtown', 5, '900 Wilshire Boulevard, Los Angeles, CA', ARRAY['la@ihg.com'], ARRAY['213-688-7777']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Miami', 5, '100 Chopin Plaza, Miami, FL', ARRAY['miami@ihg.com'], ARRAY['305-577-1000']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Boston', 5, '510 Atlantic Avenue, Boston, MA', ARRAY['boston@ihg.com'], ARRAY['617-747-1000']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental San Francisco', 5, '888 Howard Street, San Francisco, CA', ARRAY['sf@ihg.com'], ARRAY['415-616-6500']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Seattle', 5, '600 University Street, Seattle, WA', ARRAY['seattle@ihg.com'], ARRAY['206-628-4466']),
((SELECT id FROM hotel_chain WHERE name = 'InterContinental Hotels Group'), 'InterContinental Toronto Centre', 5, '225 Front Street West, Toronto, ON', ARRAY['toronto@ihg.com'], ARRAY['416-597-1400']);

-- Insert Hotels for Hyatt
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency New York', 4, '125 East 42nd Street, New York, NY', ARRAY['nyc@hyatt.com'], ARRAY['212-986-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Chicago', 4, '151 East Wacker Drive, Chicago, IL', ARRAY['chicago@hyatt.com'], ARRAY['312-565-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Los Angeles', 4, '711 South Hope Street, Los Angeles, CA', ARRAY['la@hyatt.com'], ARRAY['213-683-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Miami', 4, '400 Southeast 2nd Avenue, Miami, FL', ARRAY['miami@hyatt.com'], ARRAY['305-358-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Boston', 4, '1 Avenue de Lafayette, Boston, MA', ARRAY['boston@hyatt.com'], ARRAY['617-912-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency San Francisco', 4, '5 Embarcadero Center, San Francisco, CA', ARRAY['sf@hyatt.com'], ARRAY['415-788-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Seattle', 4, '808 Howell Street, Seattle, WA', ARRAY['seattle@hyatt.com'], ARRAY['206-973-1234']),
((SELECT id FROM hotel_chain WHERE name = 'Hyatt Hotels Corporation'), 'Hyatt Regency Toronto', 4, '370 King Street West, Toronto, ON', ARRAY['toronto@hyatt.com'], ARRAY['416-343-1234']);

-- Insert Hotels for Wyndham
INSERT INTO hotel (chain_id, name, category, address, email, phone_numbers) VALUES
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham New York Downtown', 3, '8 Spruce Street, New York, NY', ARRAY['nyc@wyndham.com'], ARRAY['212-349-1000']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Chicago Downtown', 3, '633 North St. Clair Street, Chicago, IL', ARRAY['chicago@wyndham.com'], ARRAY['312-573-0300']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Los Angeles Downtown', 3, '930 Hilgard Avenue, Los Angeles, CA', ARRAY['la@wyndham.com'], ARRAY['310-208-8765']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Miami Downtown', 3, '100 Chopin Plaza, Miami, FL', ARRAY['miami@wyndham.com'], ARRAY['305-577-1000']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Boston Downtown', 3, '89 Broad Street, Boston, MA', ARRAY['boston@wyndham.com'], ARRAY['617-556-0006']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham San Francisco Downtown', 3, '333 O''Farrell Street, San Francisco, CA', ARRAY['sf@wyndham.com'], ARRAY['415-771-1400']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Seattle Downtown', 3, '1301 6th Avenue, Seattle, WA', ARRAY['seattle@wyndham.com'], ARRAY['206-624-0500']),
((SELECT id FROM hotel_chain WHERE name = 'Wyndham Hotels & Resorts'), 'Wyndham Toronto Downtown', 3, '145 Richmond Street West, Toronto, ON', ARRAY['toronto@wyndham.com'], ARRAY['416-869-3456']);

-- Insert 5 rooms for each hotel
DO $$
DECLARE
    hotel_record RECORD;
    room_number INTEGER;
    price DECIMAL;
    capacity VARCHAR;
    amenities TEXT[];
    sea_view BOOLEAN;
    mountain_view BOOLEAN;
    extendable BOOLEAN;
BEGIN
    FOR hotel_record IN SELECT id, name FROM hotel LOOP
        -- Room 1: Single Room
        INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable)
        VALUES (
            hotel_record.id,
            '101',
            100.00,
            'single',
            ARRAY['TV', 'WiFi'],
            FALSE,
            FALSE,
            FALSE
        );

        -- Room 2: Double Room
        INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable)
        VALUES (
            hotel_record.id,
            '102',
            150.00,
            'double',
            ARRAY['TV', 'WiFi', 'Fridge'],
            TRUE,
            FALSE,
            TRUE
        );

        -- Room 3: Triple Room
        INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable)
        VALUES (
            hotel_record.id,
            '103',
            200.00,
            'triple',
            ARRAY['TV', 'WiFi', 'Fridge', 'AC'],
            TRUE,
            TRUE,
            TRUE
        );

        -- Room 4: Quad Room
        INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable)
        VALUES (
            hotel_record.id,
            '104',
            250.00,
            'quad',
            ARRAY['TV', 'WiFi', 'Fridge', 'AC', 'Microwave'],
            TRUE,
            TRUE,
            TRUE
        );

        -- Room 5: Suite
        INSERT INTO room (hotel_id, room_number, price, capacity, amenities, sea_view, mountain_view, extendable)
        VALUES (
            hotel_record.id,
            '105',
            300.00,
            'suite',
            ARRAY['TV', 'WiFi', 'Fridge', 'AC', 'Microwave', 'Kitchen'],
            TRUE,
            TRUE,
            TRUE
        );
    END LOOP;
END $$;

-- Add test employees
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
WHERE h.name LIKE '%New York%';

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
WHERE h.name LIKE '%New York%';

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
