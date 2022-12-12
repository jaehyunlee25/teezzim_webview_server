update golf_club
set
    name = "${name}",
    address = "${address}",
    area = "${area}",
    phone = "${phone}",
    email = "${email}",
    homepage = "${homepage}",
    corp_reg_number = "${corp_reg_number}",
    description = "${description}",
    updated_at = now()
where id = "${id}";