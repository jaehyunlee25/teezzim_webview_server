    doc.gbn("id")[0].value = '${login_id}';
    doc.gbn("password")[0].value = '${login_password}';
    send_id();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("Hlogin")[0].children[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */