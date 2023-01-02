var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["cyber_tab"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  cyber_tab.click();
  f_cyber_id.value = "${login_id}";
  f_cyber_pw.value = "${login_password}";
  btnCyberLogin.click();
}
