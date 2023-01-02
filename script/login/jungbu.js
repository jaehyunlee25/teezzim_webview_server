var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["loginId[1]"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  loginId[1].value = "${login_id}";
  loginPw[1].value = "${login_password}";
  doc.body.gba("onclick", "Login_Check2();")[0].click();
}
