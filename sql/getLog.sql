select 
    * 
from LOG 
where 
    DATE(created_at) = '${date}'
    and device_id = '${device_id}'
    and golf_club_id = '${golf_club_id}'
order by created_at asc;