    username.value = '${login_id}';
    password.value = '${login_password}';
    btnLogin.click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("utilMenu")[0].gtn("li")[2].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */