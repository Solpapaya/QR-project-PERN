# Watch the System Deployed Here
https://qr-project-pern.herokuapp.com/

In order to Log into the System, Here are the credentials:
</br>
+ Log In as an Admin 
Email: admin@gmail.com 
Password: 123

-Log In as a Query User
Email: queryuser@gmail.com 
Password: 123

# QR-project-PERN
Web System that keeps track of Workers PDF Tax Receipts. Made with PostgreSQL, Express, React, NodeJS and Python

# Install
npm install xlsx file-saver --save
## Install Python Libraries
sudo apt update
sudo apt install python3-pip
tesseract -> brew install tesseract/sudo apt-get install tesseract-ocr
poppler ->  brew install poppler/sudo apt-get install poppler-utils
pdf2image -> pip3 install pdf2image
https://pypi.org/project/pdf2image/
pytesseract -> pip3 install pytesseract
https://pypi.org/project/pytesseract/
zbar -> brew install zbar/sudo apt-get install zbar-tools, pip3 install zbar
https://pypi.org/project/zbar/
pyzbar -> pip3 install pyzbar
https://pypi.org/project/pyzbar/

# Deployment
ssh -i /Users/solpapaya/Documents/Social_Service/Key/papaye_key.pem papaye@20.110.36.247

sudo apt-get update
sudo apt install nodejs
sudo apt install npm

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-10

sudo su - postgres
psql
\q
createuser --interactive --pwprompt
role: tax_receipt_system_admin
password: ...
y
createdb -O tax_receipt_system_admin qr

nano /etc/postgresql/10/main/postgresql.conf
listen_addresses = '*'
host    all             all             0.0.0.0/0            md5
exit

sudo ufw allow 5432/tcp
sudo systemctl restart postgresql

sudo systemctl start postgresql@10-main

psql -h {server_ip} -d qr -U tax_receipt_system_admin

# Create Tables
create extension if not exists "uuid-ossp";

CREATE TABLE user_type (
    id SMALLSERIAL NOT NULL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50),
    surname VARCHAR(50) NOT NULL,
    second_surname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(128) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    type_id SMALLSERIAL NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_type
        FOREIGN KEY (type_id)
            REFERENCES user_type(id)
);

CREATE TABLE recover_password (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    issue_time TIMESTAMP WITH TIME ZONE NOT NULL,
    expire_time TIMESTAMP WITH TIME ZONE NOT NULL,
    already_changed_password BOOLEAN NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
            REFERENCES users(id)
);

CREATE TABLE department (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
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


CREATE TABLE deleted_tax_receipts (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    tax_receipt_date DATE NOT NULL,    
    tax_receipt_emitter VARCHAR(13) NOT NULL,
    deleted_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_by uuid  DEFAULT uuid_generate_v4() NOT NULL,
    why_was_deleted VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(deleted_by)
            REFERENCES users(id),
    CONSTRAINT fk_person
        FOREIGN KEY(tax_receipt_emitter)
            REFERENCES person(rfc)
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

# Insert Data
INSERT INTO user_type (type) VALUES
('Master'),
('Admin'),
('Consulta');

# Must Read Considerations
### You must create a Department if you want to register a new person in the System
### You must register a person if you want to upload a Tax Receipt for that person



cd /home/{azureuser}
mkdir Tax_Receipt_System
cd Tax_Receipt_System/

scp -r ../../Key/papaye_key.pem /Users/solpapaya/Documents/Social_Service/Tax-Receipt-System-AzureDeploy/server {azureuser}@20.110.36.247:/home/{azureuser}/Tax_Receipt_System

cd server
npm i
npm start


/Users/solpapaya/Documents/Social_Service/Tax-Receipt-System-AzureDeploy/server

apt-get install python3
apt-get install python3-pip

