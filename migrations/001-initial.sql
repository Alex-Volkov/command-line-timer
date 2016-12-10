-- Up

create table sessions (id integer primary key, finishTime integer, date text, duration integer, type text);

-- Down

drop table sessions;