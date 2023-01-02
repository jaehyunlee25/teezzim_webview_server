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
  btnLoginMember.click();

  /* begin: precheck content */
  function precheck() {
    const as = doc.gcn("menu_top")[7].parentNode.children[1].gtn("a");
    if (as.length < 3) return false;
    const strLogout = "로그아웃";
    const str = as[2].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
