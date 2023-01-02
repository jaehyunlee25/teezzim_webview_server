msId.value = '${login_id}';
msPw.value = '${login_password}';
actionLogin();


    /* begin: precheck content */
    function precheck() {
      if (doc.gcn("m_logout").length > 0) {
        log("ALREADY_LOGIN");
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */