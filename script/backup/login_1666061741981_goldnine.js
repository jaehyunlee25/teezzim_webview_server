    if (precheck()) return;
    doc.gbn("login_id")[0].value = "${login_id}";
    doc.gbn("login_pw")[0].value = "${login_password}";
    login_check(this.form);

    /* begin: precheck content */
    function precheck() {
      const str = doc.gcn("member")[0].children[0].str();
      if (str == "LOGOUT") {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */