btn_login_t.click();
setInterval(() => {
  log_cd.value = "${login_id}";
  log_pass.value = "${login_password}";
  btn_login.click();
}, 500);

/* begin: precheck content */
function precheck() {
  /*const strLogout = "로그아웃";
  const str = doc.gba("href", "/index.php/member/logout")[0].str();
  if (str == strLogout) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }*/
  return false;
}
/* end: precheck content */
