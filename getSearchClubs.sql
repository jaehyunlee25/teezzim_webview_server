SELECT 
	golf_club_eng.eng_id,
	golf_club.id,
	golf_club_usability.golf_club_state
FROM golf_club
JOIN golf_club_detail ON golf_club.id = golf_club_detail.golf_club_id
JOIN golf_club_eng on golf_club.id = golf_club_eng.golf_club_id
JOIN golf_club_usability ON golf_club.id = golf_club_usability.golf_club_id
WHERE golf_club_detail.reserve_script = TRUE
ORDER BY golf_club_detail.reserve_script_date asc;