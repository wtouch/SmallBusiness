--
-- File generated with SQLiteStudio v3.0.6 on Wed Nov 18 17:26:56 2015
--
-- Text encoding used: windows-1252
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: account
CREATE TABLE account (id INTEGER PRIMARY KEY, user_id INTEGER, account_name VARCHAR (256), category VARCHAR (256), account_no INTEGER, description VARCHAR (256), date DATE, status BOOLEAN DEFAULT (0));
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (2, 3, 'q', 'Cash', 2, '2sads', '2015-11-17', 0);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (3, 4, 'www', 'Cash', 222222, 'asdsa', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (4, 3, 'as', 'Bank', 2222, 'sdas', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (5, 4, 'sads', 'Cash', 21321, 'dsadsads', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (6, 1, 'sadsa', 'Credit', 23112, 'dsfsd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (7, 3, 'sfsdf', 'Loan', 3432432, 'sdfsdf', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (8, 5, 'sdfsdsdfdsfdsfffffffff', 'Credit', 23432, 'dsfsd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (9, 3, 'sdfsd', 'Cash', 3543, 'fgdfgfd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (10, 3, 'fdgfd', 'Cash', 4534, 'fdgfd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (11, 4, 'fdgfd', 'Bank', 34543, 'fdgfd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (12, 5, 'fdgfd', 'Credit', 23423, 'fgdsds', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (13, 2, 'sadsasa', 'Cash', 3432, 'sdfsd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (14, 5, 'ase', 'Cash', 2321321, 'dfgdsfsd', '2015-11-17', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (16, 3, 'wewqqw', 'Cash', 2321321, 'sdassd', '2015-11-18', 1);
INSERT INTO account (id, user_id, account_name, category, account_no, description, date, status) VALUES (17, 2, 'asdas', 'Cash', 21312321, 'asdsa', '2015-11-18', 1);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
