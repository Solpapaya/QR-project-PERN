ALTER TABLE person
ALTER COLUMN department_id DROP NOT NULL;

ALTER TABLE person
DROP CONSTRAINT fk_department;

ALTER TABLE person
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id)
REFERENCES department (id)
ON DELETE SET NULL;