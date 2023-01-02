    doc.gbn("memb_inet_no")[0].value = '${login_id}';
    doc.gbn("memb_inet_pass")[0].value = '${login_password}';
    Login_Check();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("bok_btn1_4")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */