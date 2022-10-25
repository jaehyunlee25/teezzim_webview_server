    f_id.value = '${login_id}';
    f_pw.value = '${login_password}';
    btnLoginMember.click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc
        .gcn("menu_top")[7]
        .parentNode.children[1].gtn("a")[2]
        .str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */