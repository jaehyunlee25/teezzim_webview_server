var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["ctl00_ContentPlaceHolder1_rblLoginTypeList_2"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  ctl00_ContentPlaceHolder1_rblLoginTypeList_2.click();
  ctl00_ContentPlaceHolder1_txtUserID.value = "${login_id}";
  ctl00_ContentPlaceHolder1_txtPassword.value = "${login_password}";
  ctl00_ContentPlaceHolder1_ibtnLogin.click();
}
