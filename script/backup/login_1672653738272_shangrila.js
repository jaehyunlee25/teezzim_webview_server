    user_id.value = '${login_id}';
    user_pw.value = '${login_password}';
    Login_Check();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = util.children[2].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */