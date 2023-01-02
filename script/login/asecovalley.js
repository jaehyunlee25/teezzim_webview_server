var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["quick_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  quick_id.value = "${login_id}";
  quick_pw.value = "${login_password}";
  chkLogValue("frmQuickLogin", "in", "quick_id", "quick_pw");
}
