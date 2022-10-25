    f_id.value = '${login_id}';
    f_pw.value = '${login_password}';
    doc.gcn("btn_login")[0].children[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("footer_menu")[0].gtn("a")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */