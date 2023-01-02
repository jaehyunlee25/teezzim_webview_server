var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(() => {
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
  chkLogValue("frmLogin", "in", "login_id", "login_pw");
}, 1000);
