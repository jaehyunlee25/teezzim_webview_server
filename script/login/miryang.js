var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["ContentPlaceHolder1_txtUserID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ContentPlaceHolder1_txtUserID.value = "${login_id}";
  ContentPlaceHolder1_txtPassword.value = "${login_password}";
  ContentPlaceHolder1_btnLogin.click();
}
