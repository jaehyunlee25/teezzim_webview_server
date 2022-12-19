memberId.value = "${login_id}";
memberPw.value = "${login_password}";
doc.body.gba("onclick", "login();")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const els = doc.body.gba("href", "/Mobile/Member/Login");
  if (els.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */