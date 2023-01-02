var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["ctl00_contents_txtUserID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_contents_txtUserID.value = "${login_id}";
  ctl00_contents_txtPassword.value = "${login_password}";
  ctl00_contents_lbtUserLogin.click();
}
