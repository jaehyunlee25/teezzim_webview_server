SELECT 
	golf_club_eng.eng_id,
	golf_club_login_url.mobile login_url,
	golf_club_search_url.mobile search_url
FROM golf_club_search_url
JOIN golf_club_eng ON golf_club_search_url.golf_club_id = golf_club_eng.golf_club_id
JOIN golf_club_login_url ON golf_club_search_url.golf_club_id = golf_club_login_url.golf_club_id;