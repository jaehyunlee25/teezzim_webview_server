user_id.value = '${login_id}';
user_pw.value = '${login_password}';
doc.body.gba("href", "JavaScript:Login1();")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("href", "/html/mypage/logout.asp");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */