    window["user-id-1"].value = '${login_id}';
    window["user-pw-1"].value = '${login_password}';
    doc.gcn("submit-complete")[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("mx")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */