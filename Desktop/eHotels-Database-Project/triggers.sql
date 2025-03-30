-- Make sure customers don’t have more than 2 overlapping bookings
CREATE OR REPLACE FUNCTION prevent_booking_overlap()
RETURNS TRIGGER AS $$
DECLARE
  overlapping INT;
BEGIN
  SELECT COUNT(*) INTO overlapping
  FROM bookings
  WHERE customer_id = NEW.customer_id
    AND (NEW.start_date, NEW.end_date) OVERLAPS (start_date, end_date);

  IF overlapping >= 2 THEN
    RAISE EXCEPTION 'This customer already has two overlapping bookings.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_overlapping_bookings
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION prevent_booking_overlap();

--Create an archive of every new renting
CREATE TABLE IF NOT EXISTS renting_history (
    renting_id INT,
    customer_id INT,
    room_id INT,
    employee_id INT,
    checkin DATE,
    checkout DATE,
    payment_amount DECIMAL(10,2),
    saved_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_renting_for_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO renting_history (
    renting_id, customer_id, room_id, employee_id, checkin, checkout, payment_amount
  )
  VALUES (
    NEW.id, NEW.customer_id, NEW.room_id, NEW.checked_in_by,
    NEW.checkin, NEW.checkout, NEW.amount_paid
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER backup_renting_on_insert
AFTER INSERT ON rentings
FOR EACH ROW
EXECUTE FUNCTION log_renting_for_history();
