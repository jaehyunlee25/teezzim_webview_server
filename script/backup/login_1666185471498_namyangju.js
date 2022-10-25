    doc.gbn("login_id")[0].value = '${login_id}';
    doc.gbn("login_pw")[0].value = '${login_password}';
    Login_ok();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "Log Out";
      const str = head_right.children[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */