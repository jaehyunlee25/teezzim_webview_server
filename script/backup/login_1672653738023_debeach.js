doc.gbn("username")[0].value = "${login_id}";
doc.gbn("password")[0].value = "${login_password}";
doc.body.gba("class", "btn btn-primary btn-lg btn-block")[0].click();