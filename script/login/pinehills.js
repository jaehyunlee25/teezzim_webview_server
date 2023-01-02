var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["log_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  log_id.value = "${login_id}";
  login_pw.value = "${login_password}";
  chkLogValue(
    "frmLogin",
    "in",
    "log_id",
    "login_pw",
    "login_idsave",
    "login_pwsave"
  );
}
