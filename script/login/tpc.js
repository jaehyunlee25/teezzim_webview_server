var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("mem_id")[0].value = "${login_id}";
  doc.gbn("usr_pwd")[0].value = "${login_password}";
  chkLogValue(frmLogin, "in", frmLogin.mem_id, frmLogin.usr_pwd);

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = mo_top_login.children[0].innerText;
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
