usrId.value = '${login_id}';
usrPwd.value = '${login_password}';
doc.body.gba("href", "JavaScript:fnLogin();")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("href", "/mobile/user/sign/Logout.do");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */