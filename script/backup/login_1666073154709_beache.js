    loginId.value = "newrison";
    loginPw.value = "ilovegolf77!";
    doc.gcn("btn_login_wrap")[0].children[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("mobile_login_wrap")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */