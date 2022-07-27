wid.value = '${login_id}';
wpwd.value = '${login_password}';
doc.gcn("ui-btn ui-icon-plus ui-btn-icon-left")[0].click();
timer(1000, () => {
  doc.gcn("buttons")[0].children[0].click();
});