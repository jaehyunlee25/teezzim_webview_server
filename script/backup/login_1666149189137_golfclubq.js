    txtId.value = '${login_id}';
    txtPw.value = '${login_password}';
    doLogin();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("btnType2")[0].gtn("a")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */