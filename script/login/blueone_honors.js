m_id.value = "${login_id}";
m_pwd.value = "${login_password}";
doc.body.gba("class", "cbtn cbtn_point")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "로그아웃";
  const els = doc.body.gba("href", "/content/member/logout.jsp", true);
  if (els.length > 0) {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */