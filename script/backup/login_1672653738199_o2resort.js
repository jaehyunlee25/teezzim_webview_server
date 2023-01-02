    userId.value = '${login_id}';
    password.value = '${login_password}';
    loginForm.submit();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "Logout";
      const str = commonMenu.gtn("li")[1].children[0].children[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */