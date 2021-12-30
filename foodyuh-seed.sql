-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, is_admin, is_paid)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'mask@maskymax.com',
        FALSE,
        FALSE),
        ('paiduser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Paid!',
        'paid@maskymax.com',
        FALSE,
        TRUE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'mask@maskymax.com',
        TRUE,
        TRUE);

INSERT INTO plates (name,
                        description,
                        username)
VALUES ('Pasta1', 'Italy stuff', 'testuser'), --
        ('Pasta2', 'Chinese food', 'testuser'), --
        ('Pasta3', 'for Engliand', 'testuser'), --
        ('Pasta1', 'Italy food', 'paiduser'), --
        ('Pasta2', 'for Engliand', 'paiduser'),
        ('Pasta3', 'Chinese food', 'paiduser'),
        ('Pasta1', 'Chinese food', 'testadmin'),
        ('Pasta2', 'for Engliand', 'testadmin'),
        ('Pasta3', 'Italy food', 'testadmin');

INSERT INTO plates_foods (plate_id, fdc_id)
VALUES (1, '2087659'),
        (1, '2087759'),
        (1, '2087959'),
        (1, '2087559');
