    login_id.value = '${login_id}';
    doc.gbn("login_pw")[0].value = '${login_password}';
    sendForm();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("login")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */