    login.value = '${login_id}';
    pwd.value = '${login_password}';
    LoginChk();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = doc.gcn("login")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */