    if(window["agree1"]) {
        log("1111");
        agree1.click();
        checke_form();
    } else {
        log("2222");
        memberId.value = '${login_id}';
        memberPw.value = '${login_password}';
        login();
    }
