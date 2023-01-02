var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["wid"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  wid.value = "${login_id}";
  wpwd.value = "${login_password}";
  doc.gcn("ui-btn ui-icon-plus ui-btn-icon-left")[0].click();
}
