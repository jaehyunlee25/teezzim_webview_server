var tLoginCount = 0;
log("tLoginCount", tLoginCount);
timeraction();
const tLogin = setInterval(timeraction, 1000);
function timeraction() {
  if (!window["memberId"]) {
    tLoginCount++;
    log("tLoginCount", tLoginCount);
    if (tLoginCount > 4) clearInterval(tLogin);
    return;
  }
  clearInterval(tLogin);
  if (precheck()) return;
  memberId.value = "${login_id}";
  memberPw.value = "${login_password}";
  doc.body.gba("href", "javascript:login()")[0].click();

  /* begin: precheck content */
  function precheck() {
    const strLogout = "로그아웃";
    const els = doc.body.gba("href", "/Mobile/Member/Logout");
    if (els.length > 0) {
      if (ac) ac.message("ALREADY_LOGIN");
      return true;
    }
    return false;
  }
  /* end: precheck content */
}
