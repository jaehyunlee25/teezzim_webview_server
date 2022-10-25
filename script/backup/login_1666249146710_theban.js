    doc.gbn("mem_id")[0].value = '${login_id}';
    doc.gbn("mem_pw")[0].value = '${login_password}';
    btnLogin.click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "logout";
      const str = doc
        .gcn("left_login")[0]
        .gtn("a")[0]
        .attr("href")
        .split("?")[0]
        .split("/")[2]
        .split(".")[0];
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */