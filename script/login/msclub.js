var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("login_id")[0].value = "${login_id}";
  doc.gbn("login_pw")[0].value = "${login_password}";
  Login_ok();

  /* begin: precheck content */
  function precheck() {
    const str = doc.gba("src", "/img/login_off.png");
    if (str.length > 0) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
