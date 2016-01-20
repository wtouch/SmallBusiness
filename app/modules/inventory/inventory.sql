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

CREATE TRIGGER inventory_saffleaves_id AFTER INSERT ON inventory_saffleaves BEGIN UPDATE inventory_saffleaves SET staffleave_id = (SELECT max(staffleave_id) FROM inventory_saffleaves WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: my_trigger
CREATE TRIGGER my_trigger AFTER INSERT ON inventory_account BEGIN UPDATE inventory_account SET account_id = (SELECT max(account_id) FROM inventory_account WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_transaction
CREATE TRIGGER inventory_transaction AFTER INSERT ON inventory_transaction BEGIN UPDATE inventory_transaction SET transaction_id = (SELECT max(transaction_id) FROM inventory_transaction WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_purchase_order_id
CREATE TRIGGER inventory_purchase_order_id AFTER INSERT ON inventory_purchase_order BEGIN UPDATE inventory_purchase_order SET purchase_order_id = (SELECT max(purchase_order_id) FROM inventory_purchase_order WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_quotation
CREATE TRIGGER inventory_quotation AFTER INSERT ON inventory_quotation BEGIN UPDATE inventory_quotation SET quotation_id = (SELECT max(bill_id) FROM inventory_quotation WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_staffattendance
CREATE TRIGGER inventory_staffattendance AFTER INSERT ON inventory_staffattendance BEGIN UPDATE inventory_staffattendance SET attendance_id = (SELECT max(attendance_id) FROM inventory_staffattendance WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_staff_staff_id
CREATE TRIGGER inventory_staff_staff_id AFTER INSERT ON inventory_staff BEGIN UPDATE inventory_staff SET staff_id = (SELECT max(staff_id) FROM inventory_staff WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_stock_stock_id
CREATE TRIGGER inventory_stock_stock_id AFTER INSERT ON inventory_stock BEGIN UPDATE inventory_stock SET stock_id = (SELECT max(stock_id) FROM inventory_stock WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_invoice_invoice_id
CREATE TRIGGER inventory_invoice_invoice_id AFTER INSERT ON inventory_invoice BEGIN UPDATE inventory_invoice SET invoice_id = (SELECT max(invoice_id) FROM inventory_invoice WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_tax
CREATE TRIGGER inventory_tax AFTER INSERT ON inventory_tax BEGIN UPDATE inventory_tax SET tax_id = (SELECT max(tax_id) FROM inventory_tax WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_stock_items
CREATE TRIGGER inventory_stock_items AFTER INSERT ON inventory_stock_items BEGIN UPDATE inventory_stock_items SET stock_item_id = (SELECT max(stock_item_id) FROM inventory_stock_items WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_bill_bill_id
CREATE TRIGGER inventory_bill_bill_id AFTER INSERT ON inventory_bill BEGIN UPDATE inventory_bill SET bill_id = (SELECT max(bill_id) FROM inventory_bill WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_staff_payment
CREATE TRIGGER inventory_staff_payment AFTER INSERT ON inventory_staff_payment BEGIN UPDATE inventory_staff_payment SET staff_payment_id = (SELECT max(staff_payment_id) FROM inventory_staff_payment WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_staffholidays_holiday_id
CREATE TRIGGER inventory_staffholidays_holiday_id AFTER INSERT ON inventory_staffholidays BEGIN UPDATE inventory_staffholidays SET holiday_id = (SELECT max(holiday_id) FROM inventory_staffholidays WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;

-- Trigger: inventory_party_party_id
CREATE TRIGGER inventory_party_party_id AFTER INSERT ON inventory_party BEGIN UPDATE inventory_party SET party_id = (SELECT max(party_id) FROM inventory_party WHERE user_id=new.user_id) + 1 WHERE id = new.id; END;


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
