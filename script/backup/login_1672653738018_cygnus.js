    fbmm_memno.value = '${login_id}';
    doc.gbn("fbmm_pass")[0].value = '${login_password}';
    doc.gcn("button_st1")[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("m_login_btn")[3].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */