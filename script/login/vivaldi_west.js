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
  if (doc.gcn("atag_flex")[0].str() == "로그아웃") return;
  cyberId.value = "${login_id}";
  cyberPass.value = "${login_password}";
  loginChk();
}
