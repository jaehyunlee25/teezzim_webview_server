select
    distinct(device_id)
from
    LOG
where
    DATE(created_at) = '${date}'
    and device_id != '${deviceId}'
    and (golf_club_id like '%${clubId}%' or golf_club_id like '%_log%')
order by created_at asc;