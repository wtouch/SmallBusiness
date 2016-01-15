DROP TRIGGER IF EXISTS  `hospital_staffleaves_staffleave_id` ;

CREATE DEFINER =  `root`@`localhost` TRIGGER `hr_staffleaves_staffleave_id` BEFORE INSERT ON  `hr_staffleaves` 
FOR EACH
ROW BEGIN 
SET NEW.`staffleave_id` = ( SELECT IFNULL( MAX( staffleave_id ) , 0 ) +1
FROM hr_staffleaves
WHERE user_id = NEW.user_id ) ;

END