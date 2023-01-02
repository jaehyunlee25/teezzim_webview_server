memberId.value = '${login_id}';
key.value = '${login_password}';
btn_submit.click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const str = doc.gba("href", "https://www.shinangolf.com/member/logout");
  if (str.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */