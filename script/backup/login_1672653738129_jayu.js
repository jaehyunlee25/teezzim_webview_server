plain_web_id.value = "${login_id}";
plain_password.value = "${login_password}";
doc.body.gba("onclick", "login()")[0].click();

/* begin: precheck content */
function precheck() {
  const strLogout = "Logout";
  const [el] = doc.gcn("login-button");
  if (el.str() == "strLogout") {
    if (ac) ac.message("ALREADY_LOGIN");
    return true;
  }
  return false;
}
/* end: precheck content */