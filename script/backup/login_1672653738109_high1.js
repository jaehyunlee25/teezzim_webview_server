    usrId.value = '${login_id}';
    usrPwd.value = '${login_password}';
    loginForm.submit();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc
        .gcn("outer_wrap")[1]
        .gtn("a")[1]
        .str()
        .split("\n")
        .join("");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */