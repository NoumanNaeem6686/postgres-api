ALTER TABLE `events` ADD `price` TEXT NULL DEFAULT NULL AFTER `user_id`, ADD `location` TEXT NULL DEFAULT NULL AFTER `price`;

select users.name,
users.id,
users.major,
users.email as sender_email,
users.type,
users.profile_pic,

classes.title as class_title,
colleges.title as college_title,
(select count(*) from followers where followers.user_id = users.id and follower_id=2) as i_follow,
(select count(*) from events where events.user_id = users.id) as total_events,
(select count(*) from followers where followers.user_id = users.id) as total_followers,
(select count(*) from followers where followers.follower_id = users.id) as total_follows
from users
left join classes on classes.id = users.class_id
left join colleges on colleges.id = users.college_id
where users.is_deleted = 0
and users.id = 3
and users.status=1
order by id desc