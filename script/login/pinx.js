var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["__BVID__71"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  __BVID__71.value = "${login_id}";
  __BVID__73.value = "${login_password}";
  doc.gcn("btn btn-primary btn-block")[0].click();
}
