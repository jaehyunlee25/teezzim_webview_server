loginId.value = '${login_id}';
loginPw.value = '${login_password}';
doc.body.gba("onclick", "JavaScript:Login_Check();")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("onclick", "location='/html/member/logout.asp'");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */