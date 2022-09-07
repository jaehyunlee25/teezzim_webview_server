select
    golf_club.name,
    golf_club_eng.eng_id,
    golf_club_eng.golf_club_id
from golf_club_eng
join golf_club on golf_club.id = golf_club_eng.golf_club_id;
