SELECT 
	gce.eng_id golf_club_english_name,
	gclu.admin_id golf_club_login_url_admin_id,
	gclu.admin_pw golf_club_login_url_admin_pw
FROM golf_club_login_url gclu
JOIN golf_club gc ON gc.id = gclu.golf_club_id
JOIN golf_club_eng gce ON gce.golf_club_id = gclu.golf_club_id;