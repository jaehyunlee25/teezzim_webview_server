    usrId.value = '${login_id}';
    usrPwd.value = '${login_password}';
    fnLogin();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = doc.gcn("q_login")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */