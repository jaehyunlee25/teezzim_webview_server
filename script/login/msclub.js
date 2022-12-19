doc.gbn("login_id")[0].value = '${login_id}';
doc.gbn("login_pw")[0].value = '${login_password}';
Login_ok();

    /* begin: precheck content */
    function precheck() {
      const str = doc.gba("src", "/img/login_off.png");
      if (str.length > 0) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */