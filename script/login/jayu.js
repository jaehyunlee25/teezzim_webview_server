plain_web_id.value = "${login_id}";
plain_password.value = "${login_password}";
doc.body.gba("onclick", "login()")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const els = doc.body.gba("onclick", "logout()");
  if (els.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */