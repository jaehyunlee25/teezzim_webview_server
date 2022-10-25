    txtId.value = '${login_id}';
    txtPw.value = '${login_password}';
    doLogin();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("menuTab")[0].children[0].str().trim();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */