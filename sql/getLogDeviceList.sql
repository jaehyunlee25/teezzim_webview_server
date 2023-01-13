select
    distinct(device_id)
from
    LOG
where
    DATE(CONVERT_TZ(created_at, '+00:00', '+09:00')) = '${date}'
    and device_id != '${deviceId}'
order by created_at asc;