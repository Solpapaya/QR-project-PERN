UPDATE users
SET second_name = null
WHERE first_name = 'Lionel';

UPDATE persona SET primer_nombre = 'Juan', segundo_nombre = 'Guillermo',
primer_apellido = 'Cuadrado', segundo_apellido = 'Hernandez', rfc = 'CUHJ900322KAR', activo = 'f' 
WHERE rfc = 'GRPA920113WSD';

UPDATE tax_receipt 
SET date = '2020-04-12'
WHERE id = 17;

UPDATE tax_receipt 
SET date = '2020-10-25'
WHERE id = 1;


UPDATE department
SET department_name = 'Ventas'
WHERE id = 1;
UPDATE department
SET department_name = 'Finanzas'
WHERE id = 2;
UPDATE department
SET department_name = 'Recursos Humanos'
WHERE id = 3;
