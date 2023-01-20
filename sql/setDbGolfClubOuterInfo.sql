update golf_club_outer_info
set
    weather_location_id = "${weather_location_id}",
    kakao_endLoc = "${kakao_endLoc}",
    updated_at = now()
where golf_club_id = "${id}";