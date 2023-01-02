var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("uid")[0].value = "${login_id}";
  doc.gbn("passwd")[0].value = "${login_password}";
  doc.gcn("rBtnON")[0].click();

  /* begin: precheck content */
  function precheck() {
    if (doc.gbn("uid").length == 0) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
