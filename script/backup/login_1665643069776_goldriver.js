let cnt = 0;
const t = setInterval(()=>{
  cnt++;
  if(!uid) return;
  if(cnt > 50) {
    clearInterval(t);
    return;
  }
  uid.value = '${login_id}';
  doc.getElementsByName("upwd")[0].value = '${login_password}';
  image.click();
}, 200);
