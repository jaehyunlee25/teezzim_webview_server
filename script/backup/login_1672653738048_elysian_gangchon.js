    userinfo02_01.value = '${login_id}';
    userinfo02_02.value = '${login_password}';
    fnLogin(2);

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gtn("aside")[0].gtn("a")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */