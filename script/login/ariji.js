var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["keyword22"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  keyword22.value = "${login_id}";
  keyword222.value = "${login_password}";
  chkLogValue(frmLogin, "in", frmLogin.mem_id, frmLogin.usr_pwd);
}
