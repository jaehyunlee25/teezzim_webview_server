insert into golf_club
values(
    uuid(),
    "${name}",
    "${address}",
    "${area}",
    "${phone}",
    "${email}",
    "${homepage}",
    "${corp_reg_number}",
    "${description}",
    now(),
    now()
);