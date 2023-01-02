usrId.value = "${login_id}";
usrPwd.value = "${login_password}";
fnLogin();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const els = doc.body.gba("href", "/mobile/user/sign/Logout.do");
  if (els.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */
