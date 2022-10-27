select 
    golf_club.id,
    golf_club.name,
    golf_course.id,
    golf_course.name
from golf_club
join golf_course on golf_club.id = golf_course.golf_club_id
order by golf_club.name asc;