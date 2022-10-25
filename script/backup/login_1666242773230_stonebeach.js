    loginId.value = '${login_id}';
    loginPw.value = '${login_password}';
    loginCheck();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("topmenu")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */