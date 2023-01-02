var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.body.gba("for", "m4")[0].click();
  ctl00_ContentPlaceHolder1_userID.value = "${login_id}";
  ctl00_ContentPlaceHolder1_userPass.value = "${login_password}";
  doc.body.gba("href", "javascript:loginTrigger()")[0].click();
}
