insert into question values(
    uuid(),
    "${type}",
    "${name}",
    "${email}",
    "${subject}",
    "${content}",
    now(),
    now()
);