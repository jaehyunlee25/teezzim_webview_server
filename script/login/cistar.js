var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["f_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  f_id.value = "${login_id}";
  f_pw.value = "${login_password}";
  btnLogin.click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const str = doc
      .gcn("gnb_quick_menu")[0]
      .gtn("li")[0]
      .children[0].children[0].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
