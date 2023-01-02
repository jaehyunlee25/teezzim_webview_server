var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["rdo_MemGu_C"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  rdo_MemGu_C.click();
  MN_Log_C1.value = "${login_id}";
  MP_Log_C1.value = "${login_password}";
  doc.body.gba("onclick", "frmLogin('C');")[0].click();
}
