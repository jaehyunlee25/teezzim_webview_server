    userId1.value = '${login_id}';
    userPw1.value = '${login_password}';
    doc.gcn("btn btn-block btn-login btn-lg")[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("loginBtn")[0].str().trim();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */