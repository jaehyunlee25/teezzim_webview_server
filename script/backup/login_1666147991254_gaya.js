    id.value = '${login_id}';
    inputPwd.value = '${login_password}';
    btn.click();

    /* begin: precheck content */
    function precheck() {
      const btns = doc.body.gba("alt", "로그아웃");
      if (btns.length == 0) return false;
      const strLogout = "로그아웃";
      const str = btns[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */