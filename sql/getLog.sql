select 
    * 
from LOG 
where 
    DATE(created_at) = '${date}'
    and device_id = '${device_id}';