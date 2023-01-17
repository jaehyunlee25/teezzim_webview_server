select
    distinct(device_id)
from
    LOG
where
    DATE(created_at) = '${date}'
    and device_id != '${deviceId}'
    and golf_club_id = '${club}'
order by created_at asc;