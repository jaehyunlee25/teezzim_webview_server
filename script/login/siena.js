(() => {
    document.getElementsByName('memb_inet_no_re')[0].value = '${login_id}';
    document.getElementsByName('memb_inet_pass_re')[0].value = '${login_password}';
    Login1();
})()