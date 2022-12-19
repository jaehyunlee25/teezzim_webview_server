txtId.value = '${login_id}';
txtPw.value = '${login_password}';
doc.body.gba("href", "javascript:doLogin()")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("href", "javascript:doLogout()");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */