var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["login_id"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  login_id.value = "${login_id}";
  login_pw.value = "${login_password}";
  chkLogValue(
    "frmLogin",
    "in",
    "login_id",
    "login_pw",
    "chk_saveid",
    "chk_savepw"
  );
}
