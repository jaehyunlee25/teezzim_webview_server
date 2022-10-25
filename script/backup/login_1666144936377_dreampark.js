    login_id.value = "${login_id}";
    login_pwd.value = "${login_password}";
    fncLogin("");

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("login_box")[0].children[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */