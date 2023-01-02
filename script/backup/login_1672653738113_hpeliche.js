    loginId.value = '${login_id}';
    loginPw.value = '${login_password}';
    Login1();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = util.children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */