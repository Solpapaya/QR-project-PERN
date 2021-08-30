DELETE FROM users as u WHERE u.id = '2f418786-6f49-476b-8c54-e0cac9f1ab36'
RETURNING
u.email,
u.type_id,
u.first_name || ' ' || COALESCE(u.second_name || ' ', '') 
|| u.surname || ' ' || u.second_surname as user_full_name;

DELETE FROM tax_receipt WHERE id = 6
      RETURNING 
      EXTRACT(MONTH FROM tax_receipt.date) as month,
      EXTRACT(YEAR FROM tax_receipt.date) as year,
      rfc_emitter;

DELETE FROM tax_receipt 
WHERE id = 10;

DELETE FROM department
WHERE id = 1;

DELETE FROM person
WHERE rfc = 'GRPA920113WSD';

DELETE FROM persona WHERE rfc = 'SOPD970125HDF';