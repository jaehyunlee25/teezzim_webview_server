userid.value = '${login_id}';
passwd.value = '${login_password}';
doc.body.gba("class", "btn-submit")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("href", "/api/member/logout");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */