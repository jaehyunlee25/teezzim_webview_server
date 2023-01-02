    doc.gbn("mem_id")[0].value = '${login_id}';
    doc.gbn("usr_pwd")[0].value = '${login_password}';
    chkLogValue(frmLogin,'in',frmLogin.mem_id, frmLogin.usr_pwd);

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = mo_top_login.children[0].innerText;
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */