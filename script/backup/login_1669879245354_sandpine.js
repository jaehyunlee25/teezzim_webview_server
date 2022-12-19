loginid.value = '${login_id}';
doc.gbn("password")[0].value = '${login_password}';
doc.body.gba("onclick", "javascript:Login1();")[0].click();