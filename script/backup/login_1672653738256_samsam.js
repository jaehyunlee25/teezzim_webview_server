    user_id.value = '${login_id}';
    user_pw.value = '${login_password}';
    Login1();

    /* begin: precheck content */
    function precheck() {
      const els = doc.body.gba("href", "login.asp");
      if (els.length == 0) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */