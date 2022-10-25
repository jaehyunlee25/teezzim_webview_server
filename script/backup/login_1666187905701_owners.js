    userId1.value = '${login_id}';
    userPw1.value = '${login_password}';
    Login1();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("loginBtn")[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */