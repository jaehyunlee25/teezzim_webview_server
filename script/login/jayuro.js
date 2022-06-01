(() => {
    setTimeout(()=>{
        ctl00_Content_UserID.value = '${login_id}';
        ctl00_Content_UserPassword.value = '${login_password}';
        LoginButton.click();
    }, 1000);
})()