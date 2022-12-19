    window["input-loginKey"].value = '${login_id}';
    window["input-password"].value = '${login_password}';
    doc.gcn("confirm_btn")[0].children[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("loginBtn")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */