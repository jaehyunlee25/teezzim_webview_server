    memberID.value = '${login_id}';
    memberPassword.value = '${login_password}';
    doc.gbn("loginForm")[0].submit();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = doc.gcn("tmenu")[1].gtn("a")[0].str().trim();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */