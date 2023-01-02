userId1.value = "${login_id}";
userPw1.value = "${login_password}";
doc.body.gba("onclick", "JavaScript:Login_Check();")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const els = doc.body.gba("onclick", "location='logout.asp'");
  if (els.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */