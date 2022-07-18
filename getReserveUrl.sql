SELECT 
	gc.name golf_club_name,
	gcru.mobile golf_club_search_url_mobile,
	gce.eng_id golf_club_english_name
FROM golf_club_reserve_url gcru
JOIN golf_club gc ON gc.id = gcru.golf_club_id
JOIN golf_club_eng gce ON gce.golf_club_id = gcru.golf_club_id;