select
    distinct(device_id)
from
    LOG
where
    DATE(created_at) = '${date}'
    and device_id != '${deviceId}'
order by created_at asc;