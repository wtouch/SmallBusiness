BEGIN
    SET NEW.`attendance_id` = (SELECT IFNULL(MAX(attendance_id),0) + 1 FROM hr_staffattendance WHERE user_id = NEW.user_id);
END