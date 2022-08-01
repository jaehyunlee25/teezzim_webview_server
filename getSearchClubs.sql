SELECT 
	golf_club_eng.eng_id
FROM golf_club
JOIN golf_club_detail ON golf_club.id = golf_club_detail.golf_club_id
join golf_club_eng on golf_club.id = golf_club_eng.golf_club_id
WHERE golf_club_detail.reserve_script = TRUE
ORDER BY golf_club_detail.reserve_script_date asc;