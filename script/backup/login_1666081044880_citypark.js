    doc.gbn("uid")[0].value = '${login_id}';
    doc.gbn("passwd")[0].value = '${login_password}';
    doc.gcn("rBtnON")[0].click();

    /* begin: precheck content */
    function precheck() {
      if (doc.gbn("uid").length == 0) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */