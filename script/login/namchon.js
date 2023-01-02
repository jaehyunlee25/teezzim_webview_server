if (window["agree1"]) {
  agree1.click();
  checke_form();
} else {
  memberId.value = "${login_id}";
  memberPw.value = "${login_password}";
  login();
}
