select 
    golf_club.*,
    golf_club_outer_info.weather_location_id,
    golf_club_outer_info.kakao_endLoc
from golf_club
join golf_club_outer_info on golf_club.id = golf_club_outer_info.golf_club_id;