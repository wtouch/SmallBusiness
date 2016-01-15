DROP TRIGGER IF EXISTS `hospital_staffholidays_holiday_id`;CREATE DEFINER=`root`@`localhost` TRIGGER `hr_staffholidays_holiday_id` BEFORE INSERT ON `hr_staffholidays` FOR EACH ROW BEGIN
    SET NEW.`holiday_id` = (SELECT IFNULL(MAX(holiday_id),0) + 1 FROM hr_staffholidays WHERE user_id = NEW.user_id);
END