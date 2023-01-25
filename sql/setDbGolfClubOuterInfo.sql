update golf_club_outer_info
set
    weather_location_id = "${weather_location_id}",
    kakao_location_id = "${kakao_location_id}",
    kakao_exEnc = "${kakao_exEnc}",
    kakao_eyEnc = "${kakao_eyEnc}",
    kakao_ids = "${kakao_ids}",
    kakao_endLoc = "${kakao_endLoc}"
where golf_club_id = "${id}";