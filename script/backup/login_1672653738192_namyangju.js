    doc.gbn("mem_id")[0].value = '${login_id}';
    doc.gbn("usr_pwd")[0].value = '${login_password}';
    doc.body.gba("onclick", "JavaScript:chkLogValue", true)[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = mo_top_login.str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */