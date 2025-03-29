-- Inserting Hotel Chains
INSERT INTO HotelChain (name, address, phone_number, email)
VALUES
  ('Oceanic Resorts','123 Seaside Dr, Miami, FL','3051234567','info@oceanic.com'),
  ('Northern Lights Hotels','10 Aurora Way, Anchorage, AK','9075551234','contact@nlights.com'),
  ('Urban Retreats','350 5th Ave, New York, NY','2125559999','support@urbanretreats.com'),
  ('Sunset Hospitality','55 Sunset Blvd, Los Angeles, CA','3105550000','hello@sunsethosp.com'),
  ('Maple Leaf Inns','999 Ottawa Rd, Ottawa, ON','6135551234','info@mapleleafinns.ca');


-------------------------
------ Inserting Hotels
-- Insert 8 hotels for chain_id = 1 (Oceanic Resorts)
INSERT INTO Hotel (chain_id, address, phone_number, email, category)
VALUES
  (1, '101 Miami Beach Ave, Miami, FL',      '3051111111', 'miami@oceanic.com',       5),
  (1, '202 Key Largo St, Key Largo, FL',     '3052222222', 'keylargo@oceanic.com',    4),
  (1, '303 Sunny Isles Blvd, Sunny Isles, FL','3053333333', 'sunny@oceanic.com',       5),
  (1, '404 Fort Lauderdale Dr, Ft Lauderdale,FL','3054444444','ftlaud@oceanic.com',   4),
  (1, '505 West Palm Beach Rd, West Palm, FL','3055555555', 'palmbeach@oceanic.com',  5),
  (1, '606 Tampa Bay Ln, Tampa, FL',         '8136666666', 'tampa@oceanic.com',       4),
  (1, '707 Naples St, Naples, FL',           '2397777777', 'naples@oceanic.com',      3),
  (1, '808 Orlando Ave, Orlando, FL',        '4078888888', 'orlando@oceanic.com',     5);

-- Insert 8 hotels for chain_id = 2 (Northern Lights)
INSERT INTO Hotel (chain_id, address, phone_number, email, category)
VALUES
  (2, '1 Midnight Sun Dr, Anchorage, AK',    '9071111111', 'anchorage@nlights.com',   4),
  (2, '2 Borealis St, Fairbanks, AK',        '9072222222', 'fairbanks@nlights.com',   3),
  (2, '3 Tundra Ave, Utqiagvik, AK',         '9073333333', 'barrow@nlights.com',      5),
  (2, '4 Glacier Ln, Juneau, AK',            '9074444444', 'juneau@nlights.com',      3),
  (2, '5 Eagle River Rd, Eagle River, AK',   '9075555555', 'eagleriver@nlights.com',  4),
  (2, '6 Kenai Fjords Dr, Seward, AK',       '9076666666', 'seward@nlights.com',      5),
  (2, '7 Nome Beach Blvd, Nome, AK',         '9077777777', 'nome@nlights.com',        3),
  (2, '8 Denali Park Rd, Denali, AK',        '9078888888', 'denali@nlights.com',      4);

-- Insert 8 hotels for chain_id = 3 (Urban Retreats)
INSERT INTO Hotel (chain_id, address, phone_number, email, category)
VALUES
  (3, '350 5th Ave, Manhattan, NY',    '2121111111', 'manhattan@urbanretreats.com',   5),
  (3, '1234 Broadway, Manhattan, NY',  '2122222222', 'broadway@urbanretreats.com',    4),
  (3, '230 Park Ave, Manhattan, NY',   '2123333333', 'parkave@urbanretreats.com',     5),
  (3, '1000 Walnut St, Philadelphia, PA','2154444444','philly@urbanretreats.com',     3),
  (3, '2000 Market St, Philadelphia, PA','2155555555','market@urbanretreats.com',     4),
  (3, '1500 Chestnut St, Philadelphia, PA','2156666666','chestnut@urbanretreats.com',5),
  (3, '123 Beacon St, Boston, MA',     '6177777777', 'boston@urbanretreats.com',      4),
  (3, '45 Cambridge Rd, Cambridge, MA','6178888888', 'cambridge@urbanretreats.com',   3);

-- Insert 8 hotels for chain_id = 4 (Sunset Hospitality)
INSERT INTO Hotel (chain_id, address, phone_number, email, category)
VALUES
  (4, '100 Beverly Hills Blvd, Beverly Hills, CA','3101111111','beverlyhills@sunsethosp.com',5),
  (4, '200 Santa Monica Dr, Santa Monica, CA',    '3102222222','santamonica@sunsethosp.com', 4),
  (4, '300 Hollywood Ave, Hollywood, CA',         '3233333333','hollywood@sunsethosp.com',   5),
  (4, '400 San Diego St, San Diego, CA',          '6194444444','sandiego@sunsethosp.com',    5),
  (4, '500 Downtown Sacramento Rd, Sacramento, CA','9165555555','sacramento@sunsethosp.com',4),
  (4, '600 Napa Valley Way, Napa, CA',            '7076666666','napa@sunsethosp.com',        5),
  (4, '700 Lake Tahoe Ln, Lake Tahoe, CA',        '5307777777','tahoe@sunsethosp.com',       4),
  (4, '800 Yosemite Rd, Yosemite, CA',            '2098888888','yosemite@sunsethosp.com',    3);

-- Insert 8 hotels for chain_id = 5 (Maple Leaf Inns)
INSERT INTO Hotel (chain_id, address, phone_number, email, category)
VALUES
  (5, '999 Ottawa Rd, Ottawa, ON',     '6139999999','ottawa@mapleleafinns.ca',    5),
  (5, '888 Toronto St, Toronto, ON',   '4168888888','toronto@mapleleafinns.ca',   4),
  (5, '777 Montreal Blvd, Montreal, QC','5147777777','montreal@mapleleafinns.ca',5),
  (5, '666 Vancouver Ave, Vancouver, BC','6046666666','vancouver@mapleleafinns.ca',4),
  (5, '555 Calgary Dr, Calgary, AB',   '4035555555','calgary@mapleleafinns.ca',   3),
  (5, '444 Edmonton Way, Edmonton, AB','7804444444','edmonton@mapleleafinns.ca',  4),
  (5, '333 Halifax Rd, Halifax, NS',   '9023333333','halifax@mapleleafinns.ca',   5),
  (5, '222 Quebec St, Quebec, QC',     '4182222222','quebec@mapleleafinns.ca',    3);

----------------------
------Inserting Hotel Rooms
---Chain #1: Florida
-- Hotel #1: (Miami, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (1, 120.00, 'Single', TRUE, FALSE, TRUE, NULL),
  (1, 150.00, 'Double', FALSE, FALSE, TRUE, 'Minor scuff on wall'),
  (1, 200.00, 'Suite', TRUE, FALSE, FALSE, NULL),
  (1, 180.00, 'Family', FALSE, FALSE, TRUE, 'Curtain needs repair'),
  (1, 220.00, 'Queen', TRUE, FALSE, FALSE, NULL);

 -- Hotel #2: (Key Largo, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (2, 170.00, 'Single', TRUE, FALSE, TRUE, NULL),
  (2, 200.00, 'Double', FALSE, FALSE, TRUE, NULL),
  (2, 250.00, 'Suite', TRUE, FALSE, TRUE, NULL),
  (2, 230.00, 'Family', FALSE, FALSE, TRUE, NULL),
  (2, 270.00, 'Queen', TRUE, FALSE, FALSE, NULL);

-- Hotel #3: (Sunny Isles, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (3, 130.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (3, 160.00, 'Double', TRUE,  FALSE, FALSE, 'Minor scuff on wall'),
  (3, 200.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (3, 180.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (3, 220.00, 'Queen',  TRUE,  FALSE, FALSE, NULL);

-- Hotel #4: (Ft Lauderdale, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (4, 140.00, 'Single', TRUE,  FALSE, FALSE, NULL),
  (4, 165.00, 'Double', TRUE,  FALSE, TRUE,  'Stain on carpet'),
  (4, 210.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (4, 190.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (4, 225.00, 'Queen',  TRUE,  FALSE, FALSE, 'Loose door handle');

-- Hotel #5: (West Palm Beach, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (5, 125.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (5, 155.00, 'Double', TRUE,  FALSE, FALSE, NULL),
  (5, 210.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (5, 185.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (5, 230.00, 'Queen',  TRUE,  FALSE, FALSE, NULL);

-- Hotel #6: (Tampa, FL) 
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (6, 110.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (6, 140.00, 'Double', FALSE, FALSE, FALSE, 'Window latch broken'),
  (6, 175.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (6, 160.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (6, 200.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #7: (Naples, FL)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (7, 135.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (7, 155.00, 'Double', TRUE,  FALSE, TRUE,  NULL),
  (7, 210.00, 'Suite',  TRUE,  FALSE, FALSE, 'Minor paint peel'),
  (7, 190.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (7, 220.00, 'Queen',  TRUE,  FALSE, FALSE, NULL);

-- Hotel #8: (Orlando, FL) -- typically no sea_view
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (8, 120.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (8, 150.00, 'Double', FALSE, FALSE, FALSE, 'AC vent noise'),
  (8, 180.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (8, 170.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (8, 210.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

---Chain #2: Alaska
-- Hotel #9
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (9, 100.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (9, 130.00, 'Double', FALSE, TRUE,  FALSE, NULL),
  (9, 160.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (9, 150.00, 'Family', FALSE, TRUE,  TRUE,  'Carpet worn'),
  (9, 200.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #10
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (10, 105.00, 'Single', FALSE, TRUE,  FALSE, NULL),
  (10, 135.00, 'Double', FALSE, TRUE,  TRUE,  NULL),
  (10, 170.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (10, 155.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (10, 210.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #11
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (11, 110.00, 'Single', FALSE, TRUE,  TRUE,  'Paint scratch'),
  (11, 140.00, 'Double', FALSE, TRUE,  TRUE,  NULL),
  (11, 180.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (11, 170.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (11, 220.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #12
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (12, 115.00, 'Single', FALSE, TRUE,  FALSE, NULL),
  (12, 145.00, 'Double', FALSE, TRUE,  TRUE,  'Fridge not cooling well'),
  (12, 185.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (12, 170.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (12, 210.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #13
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (13, 120.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (13, 150.00, 'Double', FALSE, TRUE,  FALSE, 'Minor scuff on table'),
  (13, 190.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (13, 175.00, 'Family', FALSE, TRUE,  TRUE,  'Carpet stain'),
  (13, 220.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #14
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (14, 130.00, 'Single', FALSE, TRUE,  FALSE, 'Heater glitch'),
  (14, 160.00, 'Double', FALSE, TRUE,  TRUE,  NULL),
  (14, 200.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (14, 185.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (14, 230.00, 'Queen',  FALSE, TRUE,  FALSE, 'Wallpaper peeling');

-- Hotel #15
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (15, 115.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (15, 145.00, 'Double', FALSE, TRUE,  FALSE, 'Loose faucet'),
  (15, 185.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (15, 170.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (15, 210.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #16
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (16, 125.00, 'Single', FALSE, TRUE,  FALSE, NULL),
  (16, 155.00, 'Double', FALSE, TRUE,  TRUE,  NULL),
  (16, 195.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (16, 180.00, 'Family', FALSE, TRUE,  TRUE,  'Small tear in couch'),
  (16, 220.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);


---Chain #3: Urban/City
-- Hotel #17
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (17, 140.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (17, 170.00, 'Double', FALSE, FALSE, FALSE, 'Some scuff on floor'),
  (17, 220.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (17, 200.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (17, 250.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #18
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (18, 130.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (18, 160.00, 'Double', FALSE, FALSE, TRUE,  'Light flickers'),
  (18, 210.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (18, 190.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (18, 230.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #19
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (19, 145.00, 'Single', FALSE, FALSE, FALSE, 'Minor scratch on desk'),
  (19, 175.00, 'Double', FALSE, FALSE, TRUE,  NULL),
  (19, 220.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (19, 200.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (19, 240.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #20
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (20, 135.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (20, 165.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (20, 210.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (20, 190.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (20, 230.00, 'Queen',  FALSE, FALSE, FALSE, 'Carpet tear');

-- Hotel #21
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (21, 140.00, 'Single', FALSE, FALSE, TRUE,  'Flickering hallway light'),
  (21, 170.00, 'Double', FALSE, FALSE, TRUE,  NULL),
  (21, 215.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (21, 195.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (21, 235.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #22
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (22, 125.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (22, 155.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (22, 195.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (22, 180.00, 'Family', FALSE, FALSE, TRUE,  'Minor ceiling crack'),
  (22, 220.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #23
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (23, 140.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (23, 170.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (23, 210.00, 'Suite',  FALSE, FALSE, FALSE, 'Stained rug'),
  (23, 190.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (23, 240.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #24
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (24, 135.00, 'Single', FALSE, FALSE, FALSE, NULL),
  (24, 165.00, 'Double', FALSE, FALSE, TRUE,  'Loose sink faucet'),
  (24, 205.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (24, 185.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (24, 225.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

---(Chain #4: California)
-- Hotel #25: Beverly Hills (urban, no mountain/sea)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (25, 180.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (25, 220.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (25, 300.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (25, 250.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (25, 350.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #26: Santa Monica (coastal: sea_view=TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (26, 150.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (26, 180.00, 'Double', TRUE,  FALSE, FALSE, NULL),
  (26, 230.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (26, 210.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (26, 260.00, 'Queen',  TRUE,  FALSE, FALSE, NULL);

-- Hotel #27: Hollywood (urban, no sea/mountain)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (27, 170.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (27, 190.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (27, 240.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (27, 220.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (27, 280.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #28: San Diego (coastal)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (28, 160.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (28, 200.00, 'Double', TRUE,  FALSE, FALSE, NULL),
  (28, 250.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (28, 220.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (28, 300.00, 'Queen',  TRUE,  FALSE, FALSE, 'Balcony door squeaks');

-- Hotel #29: Sacramento (inland, no sea/mtn)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (29, 140.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (29, 170.00, 'Double', FALSE, FALSE, FALSE, 'HVAC noise'),
  (29, 210.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (29, 190.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (29, 230.00, 'Queen',  FALSE, FALSE, FALSE, 'Stained bedspread');

-- Hotel #30: Napa (wine country, maybe partial mountain_view=TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (30, 160.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (30, 190.00, 'Double', FALSE, TRUE,  FALSE, NULL),
  (30, 240.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (30, 220.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (30, 280.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #31: Lake Tahoe (mountain_view=TRUE, possibly lake_view but we’ll call it sea_view=FALSE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (31, 150.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (31, 180.00, 'Double', FALSE, TRUE,  FALSE, NULL),
  (31, 230.00, 'Suite',  FALSE, TRUE,  FALSE, 'Antler décor damage'),
  (31, 210.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (31, 260.00, 'Queen',  FALSE, TRUE,  FALSE, 'Carpet wear near balcony');

-- Hotel #32: Yosemite (mountain_view=TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (32, 140.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (32, 170.00, 'Double', FALSE, TRUE,  FALSE, NULL),
  (32, 220.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (32, 200.00, 'Family', FALSE, TRUE,  TRUE,  'Bear claw marks outside'),
  (32, 250.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);


---(Chain #5: Canada)
-- Hotel #33: Ottawa (no sea/mtn)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (33, 130.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (33, 160.00, 'Double', FALSE, FALSE, FALSE, 'Minor desk scratch'),
  (33, 200.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (33, 180.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (33, 220.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #34: Toronto (no sea/mtn)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (34, 140.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (34, 170.00, 'Double', FALSE, FALSE, FALSE, 'Slight AC noise'),
  (34, 210.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (34, 190.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (34, 240.00, 'Queen',  FALSE, FALSE, FALSE, 'Carpet discoloration');

-- Hotel #35: Montreal (no sea/mtn)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (35, 145.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (35, 175.00, 'Double', FALSE, FALSE, TRUE,  NULL),
  (35, 220.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (35, 200.00, 'Family', FALSE, FALSE, TRUE,  'Shower drain slow'),
  (35, 250.00, 'Queen',  FALSE, FALSE, FALSE, NULL);

-- Hotel #36: Vancouver (sea_view=TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (36, 150.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (36, 180.00, 'Double', TRUE,  FALSE, FALSE, NULL),
  (36, 230.00, 'Suite',  TRUE,  FALSE, FALSE, 'Balcony door squeak'),
  (36, 210.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (36, 260.00, 'Queen',  TRUE,  FALSE, FALSE, NULL);

-- Hotel #37: Calgary (mountain_view=TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (37, 140.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (37, 170.00, 'Double', FALSE, TRUE,  FALSE, NULL),
  (37, 210.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (37, 190.00, 'Family', FALSE, TRUE,  TRUE,  NULL),
  (37, 240.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #38: Edmonton (could also do mountain_view=TRUE or no view; let’s do TRUE)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (38, 135.00, 'Single', FALSE, TRUE,  TRUE,  NULL),
  (38, 165.00, 'Double', FALSE, TRUE,  FALSE, 'Dim hallway light'),
  (38, 205.00, 'Suite',  FALSE, TRUE,  FALSE, NULL),
  (38, 185.00, 'Family', FALSE, TRUE,  TRUE,  'Stains on sofa'),
  (38, 225.00, 'Queen',  FALSE, TRUE,  FALSE, NULL);

-- Hotel #39: Halifax (sea_view=TRUE, Atlantic coast)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (39, 130.00, 'Single', TRUE,  FALSE, TRUE,  NULL),
  (39, 160.00, 'Double', TRUE,  FALSE, FALSE, NULL),
  (39, 210.00, 'Suite',  TRUE,  FALSE, FALSE, NULL),
  (39, 185.00, 'Family', TRUE,  FALSE, TRUE,  NULL),
  (39, 230.00, 'Queen',  TRUE,  FALSE, FALSE, 'Balcony paint chip');

-- Hotel #40: Quebec City (urban, no sea_view or mountain_view)
INSERT INTO Room (hotel_id, price, capacity, sea_view, mountain_view, extendable, damage_desc)
VALUES
  (40, 140.00, 'Single', FALSE, FALSE, TRUE,  NULL),
  (40, 170.00, 'Double', FALSE, FALSE, FALSE, NULL),
  (40, 220.00, 'Suite',  FALSE, FALSE, FALSE, NULL),
  (40, 200.00, 'Family', FALSE, FALSE, TRUE,  NULL),
  (40, 250.00, 'Queen',  FALSE, FALSE, FALSE, NULL);


---------------------
---- Insterting Employee's
INSERT INTO Employee (hotel_id, full_name, address, sin, role)
VALUES
  -- Chain #1: Hotel IDs 1..8 (Florida)
  (1, 'Alice Manager',   '101 Miami Beach Ave, Miami, FL',         'SIN1001', 'Manager'),
  (2, 'Bob Manager',     '202 Key Largo St, Key Largo, FL',        'SIN1002', 'Manager'),
  (3, 'Carla Manager',   '303 Sunny Isles Blvd, Sunny Isles, FL',  'SIN1003', 'Manager'),
  (4, 'Daniel Manager',  '404 Fort Lauderdale Dr, Ft Lauderdale,FL','SIN1004', 'Manager'),
  (5, 'Erin Manager',    '505 West Palm Beach Rd, West Palm, FL',  'SIN1005', 'Manager'),
  (6, 'Frank Manager',   '606 Tampa Bay Ln, Tampa, FL',            'SIN1006', 'Manager'),
  (7, 'Grace Manager',   '707 Naples St, Naples, FL',              'SIN1007', 'Manager'),
  (8, 'Hank Manager',    '808 Orlando Ave, Orlando, FL',           'SIN1008', 'Manager'),

  -- Chain #2: Hotel IDs 9..16 (Alaska)
  (9,  'Ivy Manager',    '1 Midnight Sun Dr, Anchorage, AK',       'SIN2001', 'Manager'),
  (10, 'James Manager',  '2 Borealis St, Fairbanks, AK',           'SIN2002', 'Manager'),
  (11, 'Kelly Manager',  '3 Tundra Ave, Utqiagvik, AK',            'SIN2003', 'Manager'),
  (12, 'Leo Manager',    '4 Glacier Ln, Juneau, AK',               'SIN2004', 'Manager'),
  (13, 'Mia Manager',    '5 Eagle River Rd, Eagle River, AK',      'SIN2005', 'Manager'),
  (14, 'Nate Manager',   '6 Kenai Fjords Dr, Seward, AK',          'SIN2006', 'Manager'),
  (15, 'Olive Manager',  '7 Nome Beach Blvd, Nome, AK',            'SIN2007', 'Manager'),
  (16, 'Paul Manager',   '8 Denali Park Rd, Denali, AK',           'SIN2008', 'Manager'),

  -- Chain #3: Hotel IDs 17..24 (Urban Retreats)
  (17, 'Quinn Manager',  '350 5th Ave, Manhattan, NY',             'SIN3001', 'Manager'),
  (18, 'Rita Manager',   '1234 Broadway, Manhattan, NY',           'SIN3002', 'Manager'),
  (19, 'Sam Manager',    '230 Park Ave, Manhattan, NY',            'SIN3003', 'Manager'),
  (20, 'Tina Manager',   '1000 Walnut St, Philadelphia, PA',       'SIN3004', 'Manager'),
  (21, 'Uma Manager',    '2000 Market St, Philadelphia, PA',       'SIN3005', 'Manager'),
  (22, 'Victor Manager', '1500 Chestnut St, Philadelphia, PA',     'SIN3006', 'Manager'),
  (23, 'Wendy Manager',  '123 Beacon St, Boston, MA',              'SIN3007', 'Manager'),
  (24, 'Xavier Manager', '45 Cambridge Rd, Cambridge, MA',         'SIN3008', 'Manager'),

  -- Chain #4: Hotel IDs 25..32 (California)
  (25, 'Yara Manager',   '100 Beverly Hills Blvd, Beverly Hills, CA','SIN4001','Manager'),
  (26, 'Zane Manager',   '200 Santa Monica Dr, Santa Monica, CA',   'SIN4002','Manager'),
  (27, 'Adam Manager',   '300 Hollywood Ave, Hollywood, CA',        'SIN4003','Manager'),
  (28, 'Bella Manager',  '400 San Diego St, San Diego, CA',         'SIN4004','Manager'),
  (29, 'Carl Manager',   '500 Downtown Sacramento Rd, Sacramento, CA','SIN4005','Manager'),
  (30, 'Diana Manager',  '600 Napa Valley Way, Napa, CA',           'SIN4006','Manager'),
  (31, 'Ethan Manager',  '700 Lake Tahoe Ln, Lake Tahoe, CA',       'SIN4007','Manager'),
  (32, 'Fiona Manager',  '800 Yosemite Rd, Yosemite, CA',           'SIN4008','Manager'),

  -- Chain #5: Hotel IDs 33..40 (Canada)
  (33, 'Gina Manager',   '999 Ottawa Rd, Ottawa, ON',               'SIN5001', 'Manager'),
  (34, 'Harvey Manager', '888 Toronto St, Toronto, ON',             'SIN5002', 'Manager'),
  (35, 'Irene Manager',  '777 Montreal Blvd, Montreal, QC',         'SIN5003', 'Manager'),
  (36, 'Jonas Manager',  '666 Vancouver Ave, Vancouver, BC',        'SIN5004', 'Manager'),
  (37, 'Kendra Manager', '555 Calgary Dr, Calgary, AB',             'SIN5005', 'Manager'),
  (38, 'Liam Manager',   '444 Edmonton Way, Edmonton, AB',          'SIN5006', 'Manager'),
  (39, 'Mandy Manager',  '333 Halifax Rd, Halifax, NS',             'SIN5007', 'Manager'),
  (40, 'Nick Manager',   '222 Quebec St, Quebec, QC',               'SIN5008', 'Manager');

--------
-- Inserting Sample Customer's
INSERT INTO Customer (full_name, address, id_type, registration_date)
VALUES
  ('John Doe',    '789 Elm St, Orlando, FL', 'DriverLicense', '2025-01-01'),
  ('Jane Roe',    '11 Maple St, Ottawa, ON', 'SIN',           '2025-02-10'),
  ('Mike Brown',  '22 Pine Rd, Anchorage, AK','Passport',     '2025-03-05'),
  ('Lucy Li',     '33 Cedar Ave, Fairbanks, AK','SSN',        '2025-03-07'),
  ('Chris Wong',  '44 Oak Dr, Los Angeles, CA','DriverLicense','2025-03-12'),
  ('Emily Clark', '55 Birch Ln, Manhattan, NY','SIN',         '2025-03-15'),
  ('Daniel Kim',  '66 Spruce St, Boston, MA','Passport',      '2025-03-20'),
  ('Anna Garcia', '77 Aspen Ct, Tampa, FL','SSN',             '2025-03-25'),
  ('Paul Baker',  '88 Willow St, Toronto, ON','DriverLicense', '2025-03-28'),
  ('Sara Green',  '99 Poplar Blvd, Vancouver, BC','SIN',       '2025-03-30');

----
-- Sample bookings for customers 1..5
INSERT INTO Booking (customer_id, room_id, start_date, end_date)
VALUES
  (1, 1, '2025-04-01', '2025-04-05'),  -- John Doe booking room 1
  (2, 2, '2025-04-02', '2025-04-06'),  -- Jane Roe booking room 2
  (3, 3, '2025-04-10', '2025-04-12'),  -- Mike Brown booking room 3
  (4, 4, '2025-04-08', '2025-04-09'),  -- Lucy Li booking room 4
  (5, 5, '2025-04-15', '2025-04-18');  -- Chris Wong booking room 5

--------------------------------
--Inserting Rentings
-- 1) Renting that comes from booking_id=1
--    John Doe checks in to room_id=1 for that booking
--    Must use an existing employee_id for the hotel that owns room_id=1
INSERT INTO Renting (booking_id, customer_id, room_id, employee_id, 
                     check_in_date, check_out_date, payment_amount)
VALUES
  (1, 1, 1, 1, '2025-04-01', '2025-04-05', 500.00);

-- 2) Walk-in (no booking):
--    Lucy Li (customer_id=4) arrives at room_id=12 
--    employee_id=3 is the manager of that hotel's ID
INSERT INTO Renting (booking_id, customer_id, room_id, employee_id,
                     check_in_date, check_out_date, payment_amount)
VALUES
  (NULL, 4, 12, 3, '2025-04-08', '2025-04-10', 350.00);

-- 3) Another renting referencing booking_id=2:
INSERT INTO Renting (booking_id, customer_id, room_id, employee_id,
                     check_in_date, check_out_date, payment_amount)
VALUES
  (2, 2, 2, 2, '2025-04-02', '2025-04-06', 600.00);
