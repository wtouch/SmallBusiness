--
-- File generated with SQLiteStudio v3.0.6 on Wed Nov 18 15:04:33 2015
--
-- Text encoding used: windows-1252
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: user
CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR (20), email VARCHAR (20), phone NUMERIC (10), address VARCHAR (0), location VARCHAR (30), area VARCHAR (20), city VARCHAR (12), state VARCHAR (12), country VARCHAR (23), pincode INTEGER (6), date DATE, type VARCHAR (23), designation VARCHAR, department VARCHAR, salary NUMERIC, status NUMERIC);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (1, 'vilas', 'vilas@webtouch.in', 8988989898, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 895656, '2015-11-17', 'vendor', 'developer', 'MECH', 789652, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (2, 'Pallavi', 'vilas@webtouch.in', 8988989898, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 895689, '2015-11-17', 'vendor', 'developer', 'MECH', 789652, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (3, 'abhi', 'abhi@wtouch.in', 7067698897, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 354754, '2015-11-17', 'Employee', 'develop', NULL, 3000, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (4, 'vidya', 'vidya@wtouch.in', 7855555555, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 785887, '2015-11-17', 'Employee', 'de', 'CIVIL', 456221, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (5, 'Trupti', 'trupti@wtouch.in', 9877676555, 'Pune', 'fgfg', 'fgfg', 'gdfgfg', 'fgdfgf', 'ghfghg', 87878787, '2015-11-17', 'client', 'uyuytu', 'IT', 88888888, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (6, 'pragati', 'pragati@wtouch.in', 7350398984, 'sangamner', 'sangmner', 'sangmner', 'sangmner', 'maharashtra', 'india', 46675879, '2015-11-17', 'Employee', 'developer', 'IT', 10000, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (7, 'pallavi', 'pallavi@wtouch.in', 9856324587, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 456256, '2015-11-17', 'vendor', 'develope', 'MECH', 12000, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (8, 'pallavi', 'pallavi@wtouch.in', 8965236887, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 7896589, '2015-11-17', 'vendor', 'h', 'CIVIL', 1230, 0);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (9, 'ms', 'ms@wtouch.in', 9856236589, 'pune', 'pune', 'pune', 'pune', 'pune', 'pune', 547686, '2015-11-18', 'vendor', 'develop', 'CIVIL', 365786897, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (10, 'amit', 'amit@wtouch.in', 8965567897, 'jgyf', 'hvg', 'cvcfx', 'x', 'bnv', 'bcv', 121212, '2015-11-18', 'vendor', 'fg', 'CIVIL', 15455, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (11, 'kjj', 'hggh@wtouch.in', 7895664454, 'jkh', 'gvghfg', 'fgd', 'fdfd', 'dfdfd', 'dfd', 878787, '2015-11-18', 'vendor', 'v', 'MECH', 455, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (12, 'erhrtyryt', 'dfgfg@wtouch.in', 8978978675, 'dghfgh', 'cghfhg', 'trfuytguy', 'fhgjuh', 'ghjhg', 'uj', 564675, '2015-11-18', 'vendor', 'gcv', NULL, 43564678, 1);
INSERT INTO user (id, name, email, phone, address, location, area, city, state, country, pincode, date, type, designation, department, salary, status) VALUES (13, 'rfgd', 'xfgngf@wtouch.in', 7675464536, 'dgf', 'fcghf', 'cghfvgh', 'cghvh', 'cghfvgh', 'ghfjh', 678654, '2015-11-18', 'vendor', 'ghg', 'CIVIL', 9867564353, 1);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
