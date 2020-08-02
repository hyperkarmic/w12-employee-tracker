INSERT INTO department (name) VALUES
("Finance"),
("HR"),
("Mail Room"),
("IT Support");

INSERT INTO role (title, salary, department_id) VALUES
("Accountant", 28000, 1),
("Senior Accountant", 30000, 1),
("Admin", 20000, 2),
("Recruiter", 30000, 2),
("Mail Clerk", 34000, 3),
('IT Team Lead', 36000, 4),
('IT Manager', 54000, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES
("Bob", "Smith", 1),
("John", "Smith",1),
("Chris", "Lee", 2),
("Simon", "Myers",3),
("Kenneth", "Popay", 4),
("Corey", "Clarke", 5),
("Andrew", "Wrong", 5),
("Nuel", "Popay", 6),
("Steph", "Morrissey", 7)

UPDATE `roster_db`.`employee` SET `manager_id` = '1' WHERE (`id` = '2');
UPDATE `roster_db`.`employee` SET `manager_id` = '1' WHERE (`id` = '3');
UPDATE `roster_db`.`employee` SET `manager_id` = '1' WHERE (`id` = '4');
UPDATE `roster_db`.`employee` SET `manager_id` = '7' WHERE (`id` = '5');
UPDATE `roster_db`.`employee` SET `manager_id` = '7' WHERE (`id` = '6');
UPDATE `roster_db`.`employee` SET `manager_id` = '7' WHERE (`id` = '8');
UPDATE `roster_db`.`employee` SET `manager_id` = '7' WHERE (`id` = '9');