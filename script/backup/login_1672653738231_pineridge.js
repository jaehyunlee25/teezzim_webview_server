    doc.gbn("memb_inet_no")[0].value = '${login_id}';
    doc.gbn("memb_inet_pass")[0].value = '${login_password}';
    LoginChk();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = doc.body.gba("src", "../../img/common/menu_logout.gif");
      if (str.length > 0) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */