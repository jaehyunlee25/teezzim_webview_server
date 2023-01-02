    quick_id.value = '${login_id}';
    quick_pw.value = '${login_password}';
    login_quick();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "logout";
      const str = head.children[2].attr("class");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */