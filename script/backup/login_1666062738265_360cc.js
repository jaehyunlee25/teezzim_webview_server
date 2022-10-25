    usrId2.value = "newrison";
    usrPwd2.value = "ya2ssarama!";
    fnLogin2();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str =
        window["mm-m0-p0"].children[0].children[2].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */