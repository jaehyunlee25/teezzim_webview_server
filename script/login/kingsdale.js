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
  doc.gbn("mem_id")[0].value = "${login_id}";
  doc.gbn("usr_pwd")[0].value = "${login_password}";
  chkLogValue(frmLogin, "in", frmLogin.mem_id, frmLogin.usr_pwd);
}
