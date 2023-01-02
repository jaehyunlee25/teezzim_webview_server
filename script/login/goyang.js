var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["ctl00_ContentPlaceHolder1_txtUserLoginID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_ContentPlaceHolder1_txtUserLoginID.value = "${login_id}";
  ctl00_ContentPlaceHolder1_txtLoginPassword.value = "${login_password}";
  LoginFormSubmit();
}
