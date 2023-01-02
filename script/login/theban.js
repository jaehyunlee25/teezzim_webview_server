var tLoginCount = 0;
log("tLoginCount", tLoginCount);
const tLogin = setInterval(timeraction, 1000);
timeraction();
function timeraction() {
  if (undefined) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  doc.gbn("mem_id")[0].value = "${login_id}";
  doc.gbn("mem_pw")[0].value = "${login_password}";
  btnLogin.click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "logout";
    const str = doc
      .gcn("left_login")[0]
      .gtn("a")[0]
      .attr("href")
      .split("?")[0]
      .split("/")[2]
      .split(".")[0];
    if (str == strLogout) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
