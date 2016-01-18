--
-- File generated with SQLiteStudio v3.0.6 on Mon Jan 18 17:46:46 2016
--
-- Text encoding used: windows-1252
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: inventory_purchase_order
CREATE TABLE inventory_purchase_order (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, party_id INTEGER, purchase_order_id INTEGER, purchase_order_date DATE, remark TEXT, particular TEXT, subtotal INTEGER, total_amount VARCHAR (256), duration VARCHAR (256), tax TEXT, date DATE, modified_date DATE, status INTEGER);

-- Table: inventory_stock
CREATE TABLE inventory_stock (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, stock_id INTEGER, party_id INTEGER, stock_type INTEGER, goods_name VARCHAR (256), goods_type VARCHAR (256), category VARCHAR (256), quantity INTEGER, unit VARCHAR (256), stockdate DATE, price INTEGER, status INTEGER, date DATETIME, modified_date DATE);

-- Table: inventory_quotation
CREATE TABLE inventory_quotation (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, quotation_id INTEGER, user_id INTEGER, party_id INTEGER, generated_date DATE, modified_date DATETIME, particulars TEXT, remark VARCHAR (256), date DATE, due_date DATE, status INTEGER, tax VARCHAR (256), previous_due INTEGER, subtotal INTEGER, total_amount INTEGER);

-- Table: inventory_account
CREATE TABLE inventory_account (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, account_id INTEGER, account_name VARCHAR (256), account_no VARCHAR (256), description TEXT, category VARCHAR (256), status BOOLEAN, accountdate DATETIME, date DATETIME, modified_date DATETIME);

-- Table: inventory_stock_items
CREATE TABLE inventory_stock_items (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, stock_items_id INTEGER, goods_name VARCHAR (256), goods_type VARCHAR (256), category VARCHAR (256), unit VARCHAR (256), price INTEGER, stockdate DATE, date DATE, modified_date DATETIME, status INTEGER);

-- Table: inventory_tax
CREATE TABLE inventory_tax (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, tax_id INTEGER, invoice_id INTEGER, description TEXT);

-- Table: inventory_invoice
CREATE TABLE inventory_invoice (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, invoice_id INTEGER, user_id INTEGER, party_id INTEGER, generated_date DATE, modified_date DATETIME, particulars TEXT, remark VARCHAR (256), date DATE, due_date DATE, status INTEGER, tax VARCHAR, previous_due INTEGER, subtotal INTEGER, total_amount INTEGER, payment_status INTEGER);

-- Table: inventory_transaction
CREATE TABLE inventory_transaction (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user_id INTEGER, transaction_id INTEGER, reference_id INTEGER, account_id INTEGER, module_name VARCHAR (256), type VARCHAR (256), category VARCHAR (256), credit_amount INTEGER, debit_amount INTEGER, balance INTEGER, payment_type VARCHAR (256), description TEXT, tax TEXT, date DATETIME, modified_date DATETIME, status INTEGER, transferDate DATETIME, transfer_to VARCHAR (256), transfer_from VARCHAR (256), party_id INTEGER);

-- Table: inventory_staffattendance
CREATE TABLE inventory_staffattendance (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user_id INTEGER, staff_id INTEGER, attendance_id INTEGER, attendance_date DATE, login_time VARCHAR (256), logout_time VARCHAR (256), date DATE, modified_date DATE, status INTEGER);

-- Table: inventory_staff_payment
CREATE TABLE inventory_staff_payment (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user_id INTEGER NOT NULL, staff_id INTEGER, payment_date DATE, payment_type VARCHAR (256), salary_type VARCHAR (256), status INTEGER, date DATETIME, modified_date DATETIME);

-- Table: inventory_party
CREATE TABLE inventory_party (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, party_id INTEGER, name VARCHAR (256), email VARCHAR (256), phone VARCHAR (256), address VARCHAR (256), location VARCHAR (256), area VARCHAR (256), city VARCHAR (256), state VARCHAR (256), country VARCHAR (256), pincode INTEGER, type VARCHAR (256), department VARCHAR (256), partydate DATETIME, status INTEGER, date DATETIME, modified_date DATETIME);

-- Table: inventory_staff
CREATE TABLE inventory_staff (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, staff_id INTEGER, name VARCHAR (256), surname VARCHAR (256), email VARCHAR (256), address VARCHAR (256), area VARCHAR (256), phone VARCHAR (256), city VARCHAR (256), state VARCHAR (256), country VARCHAR (256), pincode INTEGER (0), location VARCHAR (256), date_of_birth DATE, designation VARCHAR (256), doj DATE, confirmation_date DATE, department VARCHAR (256), pan_no VARCHAR (256), UAN_no VARCHAR (256), ESIC VARCHAR (256), registration_date DATE, salary VARCHAR (256), deduction INTEGER, advance INTEGER, loan INTEGER, staff_type VARCHAR (256), qualification VARCHAR (256), marital_status VARCHAR (256), gender VARCHAR (256), date DATETIME, modified_date DATETIME, status INTEGER);

-- Table: inventory_saffleaves
CREATE TABLE inventory_saffleaves (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER, staff_id INTEGER, staffleave_id INTEGER, leave_date DATE, type INTEGER, reason TEXT, approved_by VARCHAR (256), leaves_for VARCHAR (256), leave_status BOOLEAN, date DATE, modified_date DATE, status INTEGER);

-- Table: inventory_bill
CREATE TABLE inventory_bill (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, bill_id INTEGER, party_id INTEGER, user_id INTEGER, module_name VARCHAR (256), bill_date DATETIME, due_date DATETIME, remark VARCHAR (256), particular TEXT, modified_date DATETIME, date DATE, status BOOLEAN, total_amount VARCHAR, duration INTEGER, previous_due INTEGER, subtotal INTEGER, tax VARCHAR, payment_status BOOLEAN);

-- Table: inventory_staffholidays
CREATE TABLE inventory_staffholidays (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, user_id INTEGER NOT NULL, holiday_id INTEGER NOT NULL, holiday_name VARCHAR (256), holiday_date DATETIME, date DATETIME, modified_date DATETIME, status INTEGER);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
