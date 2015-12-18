--
-- File generated with SQLiteStudio v3.0.6 on Wed Nov 18 17:26:02 2015
--
-- Text encoding used: windows-1252
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: stock
CREATE TABLE stock (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER (10), goods_name VARCHAR (255), goods_type VARCHAR (255), category VARCHAR (256), quantity INTEGER (50), price INTEGER (50), unit INTEGER (50), date DATE, status BOOLEAN);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (1, 122222222222222222, 'wsdasd', 'type1', 'category3', 2, 2, 2, '2013-12-20', 0);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (2, 232, 'amar', 'type1', 'category2', 3, 3, 3, '2012-02-01', 0);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (3, 2, 'asda', 'type2', 'category2', 2, 2, 2, '2015-11-17', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (4, 23, 'dsfds', 'type4', 'category2', 2, 2, 2, '2015-11-17', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (5, 12, 'asdsa', 'type4', 'category4', 2, 2, 2, '2015-11-17', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (6, 34234, '3', 'type2', 'category2', 2, 2, 2, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (7, 2, 'ev', 'type2', 'category2', 2, 2, 2, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (8, 2, '2', 'type2', 'category2', 2, 2, 2, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (9, 22222222222222, 'dfgf', 'type2', 'category2', 3, 3, 3, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (10, 3, 'wdfd', 'type1', 'category2', 3, 3, 3, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (11, 3, '3', 'type4', 'category3', 3, 3, 3, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (12, 3, 'fd', 'type3', 'category2', 2, 2, 2, '2015-11-18', 1);
INSERT INTO stock (id, user_id, goods_name, goods_type, category, quantity, price, unit, date, status) VALUES (13, 223, 'ww', 'type2', 'category2', 2, 2, 2, '2015-11-18', 1);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
