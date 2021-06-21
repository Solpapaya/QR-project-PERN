CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type_id SMALLSERIAL NOT NULL,
    CONSTRAINT fk_user_type
        FOREIGN KEY (type_id)
            REFERENCES user_type(id)
);

CREATE TABLE user_type (
    id SMALLSERIAL NOT NULL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE person (
 id BIGSERIAL NOT NULL,
 first_name VARCHAR(50) NOT NULL,
 second_name VARCHAR(50),
 surname VARCHAR(50) NOT NULL,
 second_surname VARCHAR(50) NOT NULL,
 rfc VARCHAR(13) NOT NULL PRIMARY KEY,
 department_id BIGINT NOT NULL,
 active BOOLEAN NOT NULL,
 creation_date DATE NOT NULL,
 CONSTRAINT fk_department
        FOREIGN KEY(department_id)
            REFERENCES department(id)
);

CREATE TABLE tax_receipt (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    date DATE NOT NULL,    
    rfc_emitter VARCHAR(13) NOT NULL,
    CONSTRAINT fk_person
        FOREIGN KEY(rfc_emitter)
            REFERENCES person(rfc)
);

CREATE TABLE department (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);

CREATE TABLE status_logs (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    person_rfc VARCHAR(13) NOT NULL,
    log_date DATE NOT NULL,
    new_status BOOLEAN NOT NULL,
    CONSTRAINT fk_person
        FOREIGN KEY(person_rfc)
            REFERENCES person(rfc)
);

ALTER TABLE person
ADD COLUMN department_id BIGINT NOT NULL;

ALTER TABLE person
ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department (id);
CREATE TABLE persona (
 id BIGSERIAL NOT NULL,
 primer_nombre VARCHAR(50) NOT NULL,
 segundo_nombre VARCHAR(50),
 primer_apellido VARCHAR(50) NOT NULL,
 segundo_apellido VARCHAR(50) NOT NULL,
 rfc VARCHAR(13) NOT NULL PRIMARY KEY,
 activo BOOLEAN NOT NULL 
);

CREATE TABLE comprobante_fiscal (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    fecha_emision DATE NOT NULL,    
    rfc_emisor VARCHAR(13) NOT NULL,
    CONSTRAINT fk_persona
        FOREIGN KEY(rfc_emisor)
            REFERENCES persona(rfc)
);
