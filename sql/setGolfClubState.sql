update
    golf_club_usability 
set 
    golf_club_state = ${golfClubState},
    updated_at = NOW()
where
    golf_club_id = '${golfClubId}';
