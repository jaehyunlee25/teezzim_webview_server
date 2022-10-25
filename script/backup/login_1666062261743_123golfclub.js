    doc.gbn("userid")[0].value = "newrison";
    doc.gbn("pwd")[0].value = "ilovegolf778";
    login_check();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "LOGOUT";
      const str = doc.gcn("member")[0].children[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */