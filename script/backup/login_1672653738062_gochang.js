    const els = doc.gcn("form-control");
    els[0].value = '${login_id}';
    els[1].value = '${login_password}';
    Login1();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("login_btn")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */