var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["ctl00_ContentPlaceHolder1_txtUserID"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_ContentPlaceHolder1_txtUserID.value = "${login_id}";
  ctl00_ContentPlaceHolder1_txtPassword.value = "${login_password}";
  __doPostBack("ctl00$ContentPlaceHolder1$ibtnOK", "");
}
