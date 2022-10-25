    userId.value = '${login_id}';
    userPw.value = '${login_password}';
    Login1();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = login_wrap.children[1].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */