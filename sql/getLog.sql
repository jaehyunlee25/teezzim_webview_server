select 
    *,
    MICROSECOND(created_at) timestamp
from LOG 
where 
    DATE(CONVERT_TZ(created_at, '+00:00', '+09:00')) = '${date}'
    and device_id = '${device_id}'
    and golf_club_id = '${golf_club_id}'
order by created_at asc;