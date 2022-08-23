SELECT 
	 golf_club_in_device.device_id,
	 device.token,
	 golf_club_in_device.golf_club_id,
	 golf_club.name,
	 golf_club_eng.eng_id,
	 golf_club_in_device.created_at
FROM golf_club_in_device
JOIN device ON device.id = golf_club_in_device.device_id
JOIN golf_club ON golf_club.id = golf_club_in_device.golf_club_id
JOIN golf_club_eng ON golf_club_in_device.golf_club_id = golf_club_eng.golf_club_id
WHERE 
    golf_club_eng.eng_id = '${engName}'
	AND device.type != 'admin'
ORDER BY golf_club_in_device.created_at desc;