select 
    golf_club.name,
    golf_club_outer_info.*
from 
    golf_club_outer_info 
join golf_club on golf_club.id = golf_club_outer_info.golf_club_id
where golf_club_outer_info.golf_club_id = '${clubId}';