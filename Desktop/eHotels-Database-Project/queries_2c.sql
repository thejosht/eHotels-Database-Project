-- List all hotels in Florida that are 5-star
SELECT hotel_id, address, category
FROM Hotel
WHERE address ILIKE '%FL%'
  AND category = 5;

-- Count how many rooms each hotel has, grouping by hotel
SELECT hotel_id, COUNT(*) AS room_count
FROM Room
GROUP BY hotel_id;

-- Find customers who have a Booking in the same Room as 'John Doe'
SELECT c.full_name
FROM Customer c
WHERE c.customer_id IN (
    SELECT b.customer_id
    FROM Booking b
    WHERE b.room_id IN (
        SELECT b2.room_id
        FROM Booking b2
        WHERE b2.customer_id = 1
    )
);

-- Join Query to show Bookings with the Hotel name
SELECT bc.booking_id,
       cust.full_name AS customer_name,
       h.address      AS hotel_address,
       r.price        AS room_price,
       bc.start_date,
       bc.end_date
FROM Booking bc
     JOIN Room r ON bc.room_id = r.room_id
     JOIN Hotel h ON r.hotel_id = h.hotel_id
     JOIN Customer cust ON bc.customer_id = cust.customer_id
ORDER BY bc.start_date;
