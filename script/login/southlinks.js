var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["ctl00_Content_UserID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_Content_UserID.value = "${login_id}";
  ctl00_Content_UserPassword.value = "${login_password}";
  LoginButton[0].click();
}
