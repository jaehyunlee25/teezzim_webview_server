    Top1_txtUserID.value = '${login_id}';
    Top1_txtPassword.value = '${login_password}';
    Top1_lbLogin.click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("info")[0].gtn("a")[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */