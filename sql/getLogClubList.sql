select
    distinct(golf_club_id)
from
    LOG
where
    DATE(created_at) = '${date}'
    and device_id = '${device_id}'
order by created_at asc;