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
  doc.gbn("memb_inet_no_re")[0].value = "${login_id}";
  doc.gbn("memb_inet_pass_re")[0].value = "${login_password}";
  Login1();

  /* begin: precheck content */
  function precheck() {
    const as = doc.gcn("ml10");
    if (as.length < 2) return false;
    const strLogout = "로그아웃";
    const str = as[1].str();
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
