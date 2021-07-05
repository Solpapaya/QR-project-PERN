INSERT INTO user_type (type) VALUES
('Master'),
('Admin'),
('Consulta');

INSERT INTO department (department_name) VALUES
('Ventas'), 
('Finanzas'),
('Recursos Humanos');

INSERT INTO users (first_name, second_name, surname, second_surname, email, password,
salt, type_id) VALUES
('Bruno', null, 'Mars', 'Jutton', 'bm@gmail.com', '123', 'gfh', 1);

INSERT INTO person (first_name, second_name, surname, second_surname, rfc, department_id, active, creation_date) VALUES 
('Cristian', null, 'Castro', 'Perez', 'CAPC760418AZU', '1', '1', '2021-02-23'),
('Federico', null, 'Vilar', 'Gutierrez', 'VIGF930125PJK', '1', '1', '2021-05-13'),
('Carmina', null, 'Sumano', 'Chavez', 'SUCC961125A15', '1', '1', '2021-01-12'),
('Israel', 'Jezrael', 'Mendez', 'Frutero', 'MEFI851023M9A', '1', '1', '2021-01-23'),
('Francisco', null, 'Griezmann', 'Podol', 'GRPA920113WSD', '2', '1', '2021-02-14'),
('Juan', 'Guillermo', 'Cuadrado', 'Ruiz', 'CURJ650502FRT', '3', '1', '2021-04-01'),
('Daniel', 'Rafael', 'Solorio', 'Paredes', 'SOPD970125HDF', '3', '1', '2021-03-10');

INSERT INTO status_logs (person_rfc, log_date, new_status) VALUES
('SOPD970125HDF', '2020-02-11', '0'),
('SOPD970125HDF', '2019-10-11', '0'),
('SOPD970125HDF', '2021-04-11', '0'),
('SOPD970125HDF', '2021-04-20', '1');


INSERT INTO tax_receipt (date, rfc_emitter) VALUES 
('2020-02-12', 'MEFI851023M9A'),
('2020-05-12', 'MEFI851023M9A'),
('2020-11-12', 'SOPD970125HDF'),
('2020-10-21', 'SOPD970125HDF'),
('2020-03-10', 'SOPD970125HDF'),
('2019-01-04', 'SUCC961125A15'),
('2019-02-04', 'SUCC961125A15'),
('2019-03-04', 'SUCC961125A15'),
('2019-04-04', 'SUCC961125A15'),
('2019-09-04', 'SUCC961125A15'),
('2019-10-04', 'SUCC961125A15');

WITH inserted AS (
    INSERT INTO tax_receipt 
    (date, rfc_emitter) VALUES 
    ('2018-01-23', 'GRPA920113WSD') 
    RETURNING *
)

INSERT INTO comprobante_fiscal (fecha_emision, rfc_emisor) VALUES
('2019-01-04', 'SUCC961125A15');

INSERT INTO persona (primer_nombre, segundo_nombre, primer_apellido, 
segundo_apellido, rfc) VALUES
('Antoine', null, 'Griezmann', 'Podolski', 'GRPA920113WSD') 
RETURNING primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rfc;

INSERT INTO persona (primer_nombre, segundo_nombre, primer_apellido, 
segundo_apellido, rfc) VALUES
('Juan', null, 'Griezmann', 'Podol', 'GRPA920113WSD');

INSERT INTO persona (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rfc, activo) VALUES 
('Carmina', null, 'Sumano', 'Chavez', 'SUCC961125A15', '1'),
('Israel', 'Jezrael', 'Mendez', 'Frutero', 'MEFI851023M9A', '1'),
('Francisco', null, 'Griezmann', 'Podol', 'GRPA920113WSD', '1'),
('Juan', 'Guillermo', 'Cuadrado', 'Ruiz', 'CURJ650502FRT', '1');

INSERT INTO comprobante_fiscal (fecha_emision, rfc_emisor) VALUES 
('2020-10-12', 'MEFI851023M9A'),
('2019-01-04', 'SUCC961125A15');

INSERT INTO tax_receipt (date, rfc_emitter) VALUES 
('2020-10-12', 'MEFI851023M9A'),
('2019-01-04', 'SUCC961125A15'),
('2019-02-04', 'SUCC961125A15'),
('2019-03-04', 'SUCC961125A15'),
('2019-04-04', 'SUCC961125A15'),
('2019-09-04', 'SUCC961125A15'),
('2019-10-04', 'SUCC961125A15');

WITH inserted AS (
    INSERT INTO deleted_tax_receipts 
    (tax_receipt_date, tax_receipt_emitter, deleted_by, why_was_deleted) VALUES 
    ('2019-03-04', 'SUCC961125A15', 'ede0c762-5332-4afb-ae00-1083b7e901ff', 'Se subió otro archivo que no era') 
    RETURNING *
)
SELECT person.first_name || ' ' || COALESCE(person.second_name || ' ', '') 
|| person.surname || ' ' || person.second_surname as full_name
FROM inserted
INNER JOIN person 
ON inserted.tax_receipt_emitter = person.rfc;