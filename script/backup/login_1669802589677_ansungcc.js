ctl00_ContentPlaceHolder1_txtUserID.value = "${login_id}";
ctl00_ContentPlaceHolder1_txtPassword.value = "${login_password}";
doc.body.gba("onclick", "return LoginSubmit();")[0].click();