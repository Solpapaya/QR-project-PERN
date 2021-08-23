SELECT u.id, u.first_name, u.second_name, 
u.surname, u.second_surname, u.email,
t.type
FROM users as u
INNER JOIN user_type as t
ON u.type_id = t.id
ORDER BY u.second_name;

SELECT 
TO_CHAR(dtx.tax_receipt_date, 'dd/mm/yyyy') as tax_receipt_date,
dtx.tax_receipt_emitter as rfc_tax_receipt_emitter, 
TO_CHAR(DATE(dtx.deleted_on), 'dd/mm/yyyy') as deleted_on_date,
TO_TIMESTAMP( CAST (dtx.deleted_on AS VARCHAR), 'YYYY-MM-DD HH24:MI:SS')::time as deleted_on_time,
dtx.why_was_deleted, 
u.email,
p.first_name || ' ' || COALESCE(p.second_name || ' ', '') 
|| p.surname || ' ' || p.second_surname as tax_emitter_full_name,
u.first_name || ' ' || COALESCE(u.second_name || ' ', '') 
|| u.surname || ' ' || u.second_surname as user_full_name
FROM deleted_tax_receipts as dtx
INNER JOIN person as p
ON dtx.tax_receipt_emitter = p.rfc
INNER JOIN users as u
ON dtx.deleted_by = u.id
ORDER BY dtx.deleted_on;

SELECT 
TO_TIMESTAMP( CAST (dtx.deleted_on AS VARCHAR), 'YYYY-MM-DD HH24:MI:SS')::time as deleted_on_time
FROM deleted_tax_receipts as dtx;

SELECT person.first_name, 
person.second_name, 
person.surname, 
person.second_surname, 
person.rfc, 
person.active, 
TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
department.department_name
FROM person LEFT JOIN department
ON person.department_id = department.id
ORDER BY surname;

SELECT person.first_name, person.second_name, person.surname,
person.second_surname, person.rfc, 
department.department_name
FROM person LEFT JOIN department
ON person.department_id = department.id
WHERE rfc ILIKE 'CAPC760418AZU';

SELECT id
FROM department
WHERE department_name ILIKE 'Finanzas';

SELECT DISTINCT EXTRACT(YEAR FROM date) as years FROM tax_receipt;

SELECT DISTINCT EXTRACT(YEAR FROM date) as years FROM tax_receipt where rfc_emitter = 'SOPD970125HDF';

SELECT DISTINCT EXTRACT(YEAR FROM log_date) as years FROM status_logs where person_rfc = 'SOPD970125HDF' ORDER BY EXTRACT(YEAR FROM log_date) DESC ;

SELECT DISTINCT EXTRACT(YEAR FROM log_date) as years FROM status_logs ORDER BY EXTRACT(YEAR FROM log_date) DESC ;

SELECT id, TO_CHAR(log_date, 'dd/mm/yyyy') as date, new_status
FROM status_logs 
WHERE person_rfc = 'SOPD970125HDF'
ORDER BY log_date DESC;

SELECT tax_receipt.id, EXTRACT(YEAR FROM tax_receipt.date) as year, 
EXTRACT(MONTH FROM tax_receipt.date) as month,
person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
|| person.surname || ' ' || person.second_surname as full_name, person.rfc
FROM person INNER JOIN tax_receipt
ON person.rfc = tax_receipt.rfc_emitter
ORDER BY tax_receipt.date DESC;

SELECT EXTRACT(YEAR FROM tax_receipt.date) as year, 
EXTRACT(MONTH FROM tax_receipt.date) as month,
person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
|| person.surname || ' ' || person.second_surname as full_name, person.rfc
FROM person INNER JOIN tax_receipt
ON person.rfc = tax_receipt.rfc_emitter
WHERE tax_receipt.id = 1;

SELECT person.first_name, person.second_name, person.surname,
                person.second_surname, person.rfc, 
                department.department_name
                FROM person INNER JOIN department
                ON person.department_id = department.id
                 WHERE rfc ILIKE $1;

SELECT status_logs.id, TO_CHAR(status_logs.log_date, 'dd/mm/yyyy') as date,
status_logs.new_status, 
person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
|| person.surname || ' ' || person.second_surname as full_name, person.rfc
FROM person INNER JOIN status_logs
ON person.rfc = status_logs.person_rfc
ORDER BY status_logs.log_date DESC;

SELECT *
FROM person INNER JOIN tax_receipt
ON person.rfc = tax_receipt.rfc_emitter;

SELECT *
FROM persona INNER JOIN comprobante_fiscal
ON persona.rfc = comprobante_fiscal.rfc_emisor
WHERE rfc_emisor = 'SUCC961125A15' 
AND EXTRACT(MONTH FROM fecha_emision) = 1 
AND EXTRACT(YEAR FROM fecha_emision) = 2019;

SELECT person.first_name, person.second_name, person.surname,
person.second_surname, person.rfc, person.active, department.department_name
FROM person INNER JOIN department
ON person.department_id = department.id;

SELECT person.first_name, person.second_name, person.surname,
person.second_surname, person.rfc, person.active, 
TO_CHAR(person.creation_date, 'dd/mm/yyyy') as creation_date,
department.department_name
FROM person INNER JOIN department
ON person.department_id = department.id;


SELECT * FROM comprobante_fiscal
WHERE rfc_emisor = 'SUCC961125A15' 
AND EXTRACT(MONTH FROM fecha_emision) = 1
AND EXTRACT(YEAR FROM fecha_emision) = 2019;

SELECT primer_nombre || ' ' || COALESCE(segundo_nombre || ' ', '') 
|| primer_apellido || ' ' || segundo_apellido AS nombre_completo
FROM persona 
WHERE rfc = 'SUCC961125A15';

SELECT primer_nombre, segundo_nombre,
primer_apellido, segundo_apellido, rfc 
FROM persona
WHERE primer_nombre ILIKE 'a%'
OR segundo_nombre ILIKE 'a%'
OR primer_apellido ILIKE 'a%'
OR segundo_apellido ILIKE 'a%' ORDER BY primer_apellido;

SELECT primer_nombre, segundo_nombre,
primer_apellido, segundo_apellido, rfc 
FROM persona
WHERE primer_nombre ILIKE 'w%'
OR segundo_nombre ILIKE 'w%'
OR primer_apellido ILIKE 'w%'
OR segundo_apellido ILIKE 'w%' ORDER BY primer_apellido;

SELECT primer_nombre, segundo_nombre,
primer_apellido, segundo_apellido, rfc
FROM persona
WHERE primer_nombre ILIKE 'c%'
OR segundo_nombre ILIKE 'c%'
OR primer_apellido ILIKE 'c%'
OR segundo_apellido ILIKE 'c%'
OR rfc ILIKE 'c%'
ORDER BY primer_apellido;

`SELECT primer_nombre, segundo_nombre,
               primer_apellido, segundo_apellido, rfc
               FROM persona
               WHERE primer_nombre ILIKE $1%
               OR segundo_nombre ILIKE $1%
               OR primer_apellido ILIKE $1%
               OR segundo_apellido ILIKE $1%
               OR rfc ILIKE $1%
               ORDER BY primer_apellido`,

SELECT * FROM person
WHERE first_name || ' ' || COALESCE (second_name || ' ', '') || 
surname || ' ' || second_surname ILIKE '%sol% %p%';

SELECT * FROM person
WHERE first_name || ' ' || COALESCE (second_name || ' ', '') || 
second_surname || ' ' || surname ILIKE '%p% %s%'
OR first_name || ' ' || COALESCE (second_name || ' ', '') || 
surname || ' ' || second_surname ILIKE '%p% %s%';

SELECT * FROM person WHERE first_name || ' ' || COALESCE (second_name || ' ', '') ILIKE '%d% %r%' OR first_name || ' ' || surname ILIKE '%d% %r%' OR first_name || ' ' || second_surname ILIKE '%d% %r%' OR COALESCE (second_name || ' ', '') first_name ILIKE 
'%d% %r%' OR COALESCE (second_name || ' ', '') surname ILIKE '%d% %r%' OR COALESCE (second_name || ' ', '') second_surname ILIKE '%d% %r%' OR surname || ' ' || first_name ILIKE '%d% %r%' OR surname || ' ' || COALESCE (second_name || ' ', '') ILIKE '%d% %r%' OR surname 
|| ' ' || second_surname ILIKE '%d% %r%' OR second_surname || ' ' || first_name ILIKE '%d% %r%' OR second_surname || ' ' || COALESCE (second_name || ' ', '') ILIKE '%d% %r%' OR second_surname || ' ' || surname ILIKE '%d% %r%';

SELECT * FROM person WHERE COALESCE (second_name || ' ', '') first_name ILIKE '%d% %r%'

SELECT * FROM person
WHERE first_name || ' ' || second_name || ' ' || 
second_surname || ' ' || surname ILIKE '%p% %s%'

SELECT * FROM person WHERE first_name || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR first_name || ' ' || surname ILIKE $1 OR first_name || ' ' || second_surname ILIKE $1 OR COALESCE (second_name || ' ', '') || first_name ILIKE $1 OR COALESCE (second_name || ' ', '') || surname ILIKE $1 OR COALESCE (second_name || ' ', '') || second_surname ILIKE $1 OR surname || ' ' || first_name ILIKE $1 OR surname || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR surname || ' ' || second_surname ILIKE $1 OR second_surname || ' ' || first_name ILIKE $1 OR second_surname || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR second_surname || ' ' || surname ILIKE $1

SELECT * FROM person
WHERE first_name || ' ' || COALESCE (second_name || ' ', '') ||
second_surname || ' ' || surname ILIKE $1
OR first_name || ' ' || COALESCE (second_name || ' ', '') || 
surname || ' ' || second_surname ILIKE $1 


SELECT * FROM person WHERE first_name || ' ' || COALESCE (second_name || ' ', '') || surname ILIKE $1 OR first_name || ' ' || COALESCE (second_name || ' ', '') || second_surname ILIKE $1 OR first_name || ' ' || surname || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR first_name || ' ' || surname || ' ' || second_surname ILIKE $1 OR first_name || ' ' || second_surname || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR first_name || ' ' || second_surname || ' ' || surname ILIKE $1 OR COALESCE (second_name || ' ', '') || first_name || ' ' || surname ILIKE $1 OR COALESCE (second_name || ' ', '') || first_name || ' ' || second_surname ILIKE $1 OR COALESCE (second_name || ' ', '') || surname || ' ' || first_name ILIKE $1 OR COALESCE (second_name || ' ', '') || surname || ' ' || second_surname ILIKE $1
OR COALESCE (second_name || ' ', '') || second_surname || ' ' || first_name ILIKE $1 OR COALESCE (second_name || ' ', '') || second_surname || ' ' || surname ILIKE $1 OR surname || ' ' || first_name || ' ' || COALESCE (second_name ||
' ', '') ILIKE $1 OR surname || ' ' || first_name || ' ' || second_surname ILIKE $1 OR surname || ' ' || COALESCE (second_name || ' ', '') || first_name ILIKE $1 OR surname || ' ' || COALESCE (second_name || ' ', '') || second_surname ILIKE $1 OR surname || ' ' || second_surname || ' ' || first_name ILIKE $1 OR surname || ' ' || second_surname || '
' || COALESCE (second_name || ' ', '') ILIKE $1 OR second_surname || ' ' || first_name || ' ' || COALESCE (second_name || ' ', '') ILIKE $1 OR second_surname || ' ' || first_name || ' ' || surname ILIKE $1 OR second_surname || ' ' ||
COALESCE (second_name || ' ', '') || first_name ILIKE $1 OR second_surname || ' ' || COALESCE (second_name || ' ', '') || surname ILIKE $1 OR second_surname || ' ' || surname || ' ' || first_name ILIKE $1 OR second_surname || ' ' || surname || ' ' || COALESCE (second_name || ' ', '') ILIKE $1

SELECT * FROM person
WHERE first_name ILIKE 'sop%'
OR second_name ILIKE 'sop%'
OR surname ILIKE 'sop%'
OR second_surname ILIKE 'sop%'
OR rfc ILIKE 'sop%'
ORDER BY surname

SELECT id, extract(month from date) AS month, extract(year from date) AS year  FROM tax_receipt WHERE rfc_emitter = 'SUCC961125A15';

SELECT id, extract(month from date) AS month, extract(year from date) AS year FROM tax_receipt WHERE rfc_emitter = 'SUCC961125A15' ORDER BY extract(year from date) DESC;

SELECT primer_nombre || ' ' || COALESCE(segundo_nombre || ' ', '') 
|| primer_apellido || ' ' || segundo_apellido as nombre_completo, rfc
FROM persona INNER JOIN comprobante_fiscal
ON persona.rfc = comprobante_fiscal.rfc_emisor
WHERE rfc_emisor = 'SUCC961125A15' 
AND EXTRACT(MONTH FROM fecha_emision) = 1 
AND EXTRACT(YEAR FROM fecha_emision) = 2019;