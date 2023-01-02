var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["userId"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  userId.value = "${login_id}";
  password.value = "${login_password}";
  loginForm.submit();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "Logout";
    const str = commonMenu.gtn("li")[1].children[0].children[0].attr("alt");
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
