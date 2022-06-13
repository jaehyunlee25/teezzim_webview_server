SELECT 
	golf_club_eng.eng_id golf_club_english_name, 
	golf_course.golf_club_id,
	golf_course.id golf_course_id,
	golf_course.name golf_course_name,
	golf_course.description
FROM golf_course 
JOIN golf_club ON golf_club.id = golf_course.golf_club_id
JOIN golf_club_eng ON golf_club_eng.golf_club_id = golf_course.golf_club_id
ORDER BY golf_course.created_at DESC;