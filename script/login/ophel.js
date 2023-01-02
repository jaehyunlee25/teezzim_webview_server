var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["ctl00_contents_MobileLoginControl_UserID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_contents_MobileLoginControl_UserID.value = "${login_id}";
  ctl00_contents_MobileLoginControl_UserPassword.value = "${login_password}";
  ctl00_contents_MobileLoginControl_LoginButton.click();
}
