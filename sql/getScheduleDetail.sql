select 
    golf_club.id club_id,
    golf_club.name club_name,
    golf_course.id course_id,
    golf_course.name course_name
from golf_club
join golf_course on golf_club.id = golf_course.golf_club_id
order by golf_club.name asc;