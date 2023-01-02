var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (!window["uid"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  uid.value = "${login_id}";
  upw.value = "${login_password}";
  loginform.submit();

  /* begin: precheck content */
  function precheck() {
    const as = doc.body.gba("href", "/member/logout.php");
    if (as.length == 0) return false;
    const strLogout = "logout";
    const str = as[0].attr("href").split("/")[2].split(".")[0];
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
