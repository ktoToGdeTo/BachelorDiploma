insert into role values (1, 'ROLE_ADMIN'), (2, 'ROLE_MODERATOR'), (3, 'ROLE_USER');

insert into task_status values (1, 'OPEN'), (2, 'CLOSED'), (3, 'IN_PROGRESS'), (4, 'DONE');

select * from role;
select * from task_status;

insert into users (first_name, last_name, username, password, birth_date, register_date)
values ('Mike', 'Smith', 'mikeSmith2020', '123', '2000-02-01', '2026-05-21')

select * from users
select * from task where created_by = 2
select * from users_roles

select * from task t join users u on t.created_by = u.user_id where u.username = 'mikeSmith2020'

select u.username, r.name from users u join users_roles ur on u.user_id = ur.user_id
join role r on ur.role_id = r.role_id

select exists (select 1 from users where username = 'mikeSmith20202')

insert into task (title, description, created_time, changed_time, status, created_by)
values ('Task2', 'DESSSc', '2026-02-03', '2026-05-05', 2, 1)

select title, ts.status_name from task join task_status ts on status = ts.status_id