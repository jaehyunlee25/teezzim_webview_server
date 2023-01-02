var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["usrId2"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  usrId2.value = "${login_id}";
  usrPwd2.value = "${login_password}";
  fnLogin2();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str =
      window["mm-m0-p0"].children[0].children[2].children[0].attr("alt");
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
