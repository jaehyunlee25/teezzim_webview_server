try{
  mem_id.value = '${login_id}';
  mem_pw.value = '${login_password}';
  document.loign.submit();
}catch(e){
  location.href = "http://www.centeriumcc.com/mobile/myzone/stateReser.asp";
}
