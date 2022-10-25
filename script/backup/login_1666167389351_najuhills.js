    id_username.value = '${login_id}';
    id_password.value = '${login_password}';
    doc.gcn("btn btn-theme-border btn-lg btn-block")[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("sign")[0].children[1].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */