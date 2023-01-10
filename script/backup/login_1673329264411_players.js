var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["subcontent"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  const ipts = subcontent.getElementsByTagName("input");
  ipts[0].value = "${login_id}";
  ipts[2].value = "${login_password}";
  ipts[1].click();
}
