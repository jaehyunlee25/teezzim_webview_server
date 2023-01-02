    userId1.value = '${login_id}';
    userPw1.value = '${login_password}';
    Login_Check();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "logout";
      const str = doc
        .gcn("loginBtn")[0]
        .children[0].attr("src")
        .split("/")[3]
        .split(".")[0];
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */