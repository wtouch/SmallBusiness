--
-- File generated with SQLiteStudio v3.0.6 on Thu Nov 19 10:59:44 2015
--
-- Text encoding used: windows-1252
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: transaction
CREATE TABLE "transaction" (id INTEGER (10) PRIMARY KEY, user_id INTEGER (10), account_no INTEGER, invoice_id INTEGER, bill_id INTEGER, type VARCHAR (256), category VARCHAR, description VARCHAR, date DATETIME, due_amount INTEGER, credit_amount INTEGER, debit_amount INTEGER, balance INTEGER, status BOOLEAN DEFAULT (0));
INSERT INTO "transaction" (id, user_id, account_no, invoice_id, bill_id, type, category, description, date, due_amount, credit_amount, debit_amount, balance, status) VALUES (1, 1, 23232, 22, 2, 'ss', 'dd', 'sdsd', '2-2-2015', 6000, 7000, 7000, 0, 1);
INSERT INTO "transaction" (id, user_id, account_no, invoice_id, bill_id, type, category, description, date, due_amount, credit_amount, debit_amount, balance, status) VALUES (NULL, 5, 45, NULL, NULL, 'income', NULL, NULL, '2015-11-8 11:24:43', 54, 54, NULL, NULL, 0);
INSERT INTO "transaction" (id, user_id, account_no, invoice_id, bill_id, type, category, description, date, due_amount, credit_amount, debit_amount, balance, status) VALUES (NULL, 4, 544, NULL, NULL, 'income', NULL, NULL, '2015-11-8 11:29:42', 54, 54, 54, NULL, 0);

-- Table: __WebKitDatabaseInfoTable__
CREATE TABLE __WebKitDatabaseInfoTable__ (key TEXT NOT NULL ON CONFLICT FAIL UNIQUE ON CONFLICT REPLACE,value TEXT NOT NULL ON CONFLICT FAIL);
INSERT INTO __WebKitDatabaseInfoTable__ ("key", value) VALUES ('WebKitDatabaseVersionKey', '1.0');

-- Table: stock
CREATE TABLE stock (id INTEGER (10) PRIMARY KEY, user_id INTEGER (10), goods_name VARCHAR (256), goods_type VARCHAR (256), category VARCHAR (256), quantity INTEGER, price INTEGER, unit INTEGER, status BOOLEAN DEFAULT (0), date DATE);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, status, date) VALUES (1, 213, 'aaaaaaaaaaaaaaaa', 'type1', 'category1', 34, 34, 34, 1, '2015-11-16');
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, status, date) VALUES (2, 1, 'dfgdsfg', 'type2', 'category1', 45, 45, 45, 1, '2015-11-16');

-- Table: config
CREATE TABLE config (id INTEGER PRIMARY KEY, config_name VARCHAR (256), config_data VARCHAR (256));
INSERT INTO config (id, config_name, config_data) VALUES (1, 'category', '{"category":
[{"name":"Licence Fees","system_name":"Licence Fees", "type" : "income"},
{"name":"Agriculture","system_name":"Agriculture", "type" : "income"},
{"name":"Commissions","system_name":"Commissions", "type" : "income"},
{"name":"Fees & Charges","system_name":"Fees & Charges", "type" : "income"},
{"name":"Investments","system_name":"Investments", "type" : "income"},
{"name":"Non-Profit","system_name":"Non-Profit", "type" : "income"},
{"name":"Other Income","system_name":"Other Income", "type" : "income"},
{"name":"income","system_name":"income", "type" : "income"},
{"name":"Professional Services","system_name":"Professional Services", "type" : "income"},
{"name":"Sales Product & Services","system_name":"Sales Product & Services", "type" : "income"},
{"name":"Agriculture","system_name":"Agriculture", "type" : "expense"},
{"name":"Pets","system_name":"Pets", "type" : "expense"},
{"name":"Building & Equipments","system_name":"Building & Equipments", "type" : "expense"},
{"name":"Household","system_name":"Household", "type" : "expense"},
{"name":"Computers/Communication","system_name":"Computers/Communication", "type" : "expense"},
{"name":"Fees,Charges & Subscription","system_name":"Fees,Charges & Subscription", "type" : "expense"},
{"name":"Insurance","system_name":"Insurance", "type" : "expense"},
{"name":"Financial","system_name":"Financial", "type" : "expense"},
{"name":"Non-Profit","system_name":"Non-Profit", "type" : "expense"},
{"name":"Office","system_name":"Office", "type" : "expense"},
{"name":"Other Expenses","system_name":"Other Expenses", "type" : "expense"},
{"name":"Donation & Gifts","system_name":"Donation & Gifts", "type" : "expense"},
{"name":"Other","system_name":"Other", "type" : "expense"},
{"name":"Payroll","system_name":"Payroll", "type" : "expense"},
{"name":"Services","system_name":"Services", "type" : "expense"},
{"name":"Taxes","system_name":"Taxes", "type" : "expense"}]
}');

-- Table: user
CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR (20), email VARCHAR (20), phone NUMERIC (10), address VARCHAR (0), location VARCHAR (30), area VARCHAR (20), city VARCHAR (12), state VARCHAR (12), country VARCHAR (23), pinCode INTEGER (6), date DATE, type VARCHAR (23), designation VARCHAR, department VARCHAR, salary NUMERIC, status NUMERIC);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pinCode, date, type, designation, department, salary, status) VALUES (1, 'vilas', 'vilas@webtouch.in', 8988989898, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 895656, '2015-11-17', 'vendor', 'developer', 'MECH', 789652, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pinCode, date, type, designation, department, salary, status) VALUES (2, 'Pallavi', 'vilas@webtouch.in', 8988989898, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 895689, '2015-11-17', 'vendor', 'developer', 'MECH', 789652, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pinCode, date, type, designation, department, salary, status) VALUES (3, 'abhi', 'abhi@wtouch.in', 7067698897, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 354754, '2015-11-17', 'Employee', 'develop', NULL, 3000, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pinCode, date, type, designation, department, salary, status) VALUES (4, 'vidya', 'vidya@wtouch.in', 7855555555, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 785887, '2015-11-17', 'Employee', 'de', '', 456221, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pinCode, date, type, designation, department, salary, status) VALUES (5, 'abhi', 'abhi@gmail.com', 7057440181, '55699596', 'adfjkh', 'sdjfh', 'asdjfh', 'rfth', 'bzxfc', 411019, '2015-11-18', 'client', 'fgb', 'IT', 456, 1);

-- Table: bill
CREATE TABLE bill (id INTEGER PRIMARY KEY,user_id INTEGER,property_id INTEGER,previous_due INTEGER,subtotal INTEGER,tax INTEGER,total_amount INTEGER,duration INTEGER,particulars VARCHAR,remark VARCHAR,generated_date DATE,due_date DATE,status BOOLEAN DEFAULT (0),payment_status BOOLEAN DEFAULT (0));
INSERT INTO bill (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status) VALUES (1, 1, 1, 1200, 499, 94, 49, 34, '349', '4', 34, 34, 9, 934);

-- Table: invoice
CREATE TABLE invoice (id INTEGER PRIMARY KEY, user_id INTEGER, property_id INTEGER, previous_due INTEGER, subtotal INTEGER, tax INTEGER, total_amount INTEGER, duration INTEGER, particulars VARCHAR, remark VARCHAR, generated_date DATE, due_date DATE, status BOOLEAN DEFAULT (0), payment_status BOOLEAN DEFAULT (0), singleparticular VARCHAR (255));
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (50, NULL, NULL, 678, NULL, '{"tax1":true,"tax2":true}', NULL, 876, '[{"particular_name":"akgh","price":"67","quantity":"86","amount":"8","$$hashKey":"06Z"}]', 'jagh', '2015-11-18 16:15:32', '2015-11-18 16:15:32', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (51, NULL, NULL, NULL, NULL, '{"tax1":true,"tax2":true}', NULL, NULL, '[]', 'hjhnkh', '2015-11-18 11:4:21', '2015-11-18 11:4:21', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (53, NULL, NULL, NULL, NULL, '{"tax1":true}', NULL, NULL, '[{"payment_status":"0","particular_name":"aaaaaaaaa","price":"4","quantity":"4","amount":"4","$$hashKey":"065"}]', 'aaaaaa', '2015-11-18 12:25:55', '2015-11-18 12:25:55', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (54, NULL, NULL, NULL, NULL, '{"tax2":true,"tax1":true}', NULL, NULL, '[{"payment_status":"2","particular_name":"aaaa","price":"6","quantity":"6","amount":"6","$$hashKey":"06F"}]', 'jhhhhhhhhhhh', '2015-11-18 12:25:55', '2015-11-18 12:25:55', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (55, NULL, NULL, NULL, NULL, '{"tax1":true}', NULL, NULL, '[{"payment_status":"2","particular_name":"skdh","price":"65","quantity":"67","amount":"876","$$hashKey":"06Q"}]', 'asgdfj', '2015-11-18 12:25:55', '2015-11-18 12:25:55', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"payment_status":"3","particular_name":"jds","price":"98","amount":"98","quantity":"987","$$hashKey":"045"}]', 'jhdsg', '2015-11-18 12:30:53', '2015-11-18 12:30:53', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (57, NULL, NULL, NULL, NULL, '{"tax1":true}', NULL, NULL, '[{"payment_status":"0","particular_name":"gbjbjnb","price":"67","quantity":"67","amount":"67","$$hashKey":"04J"}]', 'hjghj', '2015-11-18 12:33:46', '2015-11-18 12:33:46', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (58, NULL, NULL, NULL, NULL, '{"tax1":true}', NULL, NULL, '[{"payment_status":"1","particular_name":"qwq","price":"12","quantity":"2","amount":"3","$$hashKey":"057"}]', 'jlkj', '2015-11-18 12:33:46', '2015-11-18 12:33:46', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (59, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"particular_name":"hggh","price":"67","quantity":"67","amount":"67","$$hashKey":"05B"}]', 'jhgjh', '2015-11-18 12:37:40', '2015-11-18 12:37:40', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (60, 2, NULL, NULL, NULL, NULL, NULL, NULL, '[{"particular_name":"fgfhgfh","price":"1","quantity":"1","amount":"1","$$hashKey":"05P"}]', 'lklk', '2015-11-18 12:38:26', '2015-11-18 12:38:26', 0, 0, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (61, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"particular_name":"sd","price":"5","quantity":"65","amount":"56","$$hashKey":"063"}]', 'fh', '2015-11-18 12:39:28', '2015-11-18 12:39:28', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (62, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"particular_name":"vxc","price":"56","quantity":"6","amount":"57","$$hashKey":"064"}]', 'fdj', '2015-11-18 12:40:36', '2015-11-18 12:40:36', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (63, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{"particular_name":"hcg","price":"456","quantity":"6","amount":"6","$$hashKey":"06E"}]', 'm', '2015-11-18 12:40:36', '2015-11-18 12:40:36', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (64, NULL, NULL, NULL, NULL, NULL, NULL, 45, '[{"particular_name":"asdf","price":"45","quantity":"45","amount":"6","$$hashKey":"064"}]', 'gg', '2015-11-18 12:48:17', '2015-11-18 12:48:17', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (65, NULL, NULL, 34, NULL, NULL, NULL, 3, '[{"particular_name":"cfgfg","price":"34","quantity":"3","amount":"3","$$hashKey":"064"}]', 'fgdfg', '2015-11-18 13:44:27', '2015-11-18 13:44:27', 1, 1, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (66, NULL, NULL, 65, NULL, NULL, NULL, 56, '[{"particular_name":"fdcf","price":"56","quantity":"56","amount":"56","$$hashKey":"06S"}]', 'hgjhjh', '2015-11-18 16:44:0', '2015-11-18 16:44:0', 1, 2, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (67, NULL, NULL, 32, NULL, '{"tax1":true}', NULL, 32, '[{"particular_name":"vb","price":"23","quantity":"23","amount":"32","$$hashKey":"08C"}]', 'bvcbvg', '2015-11-18 17:57:5', '2015-11-18 17:57:5', 1, 0, NULL);
INSERT INTO invoice (id, user_id, property_id, previous_due, subtotal, tax, total_amount, duration, particulars, remark, generated_date, due_date, status, payment_status, singleparticular) VALUES (68, NULL, NULL, 34, NULL, '{"tax1":true}', NULL, 34, '[{"particular_name":"hkjhk","price":"34","quantity":"34","amount":"34","$$hashKey":"08M"}]', 'cxgfvcxvc', '2015-11-18 17:57:5', '2015-11-18 17:57:5', 1, 1, NULL);

-- Table: account
CREATE TABLE account (id INTEGER PRIMARY KEY, user_id INTEGER, account_name VARCHAR (256), category VARCHAR (256), account_no INTEGER, description VARCHAR (256), date DATE, status BOOLEAN DEFAULT (0));
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (1, 8, 'gf', 'Bank', 987898, 'desc1', '2015-11-07', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (2, 11, 'hghg', 'Bank', 88889, 'desc1', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (3, 2, 'sav', 'Bank', 464636, 'fdjklgh', '2015-11-18', 1);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
