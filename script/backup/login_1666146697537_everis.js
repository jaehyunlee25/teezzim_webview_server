    memberId.value = '${login_id}';
    key.value = '${login_password}';
    btn_submit.click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("side_top")[0].gtn("a")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */