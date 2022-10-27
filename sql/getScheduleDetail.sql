select 
    golf_club.*,
    golf_course.id course_id,
    golf_course.name course_name,
    golf_course.description
from golf_club
join golf_course on golf_club.id = golf_course.golf_club_id;
/* where golf_club.id = '${golf_club_id}'
and golf_course.name in ('${golf_course}'); */