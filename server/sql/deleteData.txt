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