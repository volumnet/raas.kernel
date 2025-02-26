CREATE TABLE IF NOT EXISTS {$DBPREFIX$}attachments (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  classname varchar(255) NOT NULL DEFAULT '' COMMENT 'Parent class name',
  pid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Parent ID#',
  image tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Is image',
  realname varchar(255) NOT NULL DEFAULT '0' COMMENT 'Real file name',
  filename varchar(255) NOT NULL DEFAULT '0' COMMENT 'Original file name',
  mime varchar(255) NOT NULL DEFAULT '0' COMMENT 'MIME-type',
  PRIMARY KEY (id),
  KEY classname (classname,pid),
  KEY classname_2 (classname),
  KEY pid (pid),
  INDEX realname (realname(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Attachments';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}crontab (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  name VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Name',
  vis TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Is active',
  once TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Process once',
  minutes VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Minutes',
  hours VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Hours',
  days VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Days',
  weekdays VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Weekdays',
  command_line VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Arbitrary command line',
  command_classname VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Command classname',
  args TEXT NULL DEFAULT NULL COMMENT 'Command arguments',
  start_time DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Processing start time',
  save_log TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Save log',
  email_log VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Email for sending log',
  priority INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Priority',

  PRIMARY KEY (id),
  INDEX (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Crontab';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}crontab_logs (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  pid INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Crontab task ID#',
  post_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Backup date/time',
  attachment_id INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Attachment ID#',
  
  PRIMARY KEY (id),
  KEY (pid),
  INDEX (post_date),
  KEY (attachment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Crontab logs';

CREATE TABLE IF NOT EXISTS `{$DBPREFIX$}groups` (
  id smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  pid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Parent group ID#',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'Name',
  description text COMMENT 'Description',
  PRIMARY KEY (id),
  KEY pid (pid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Groups of users';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}groups_levels_assoc (
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  lid smallint(6) NOT NULL DEFAULT '0' COMMENT 'Level ID#',
  PRIMARY KEY (gid,m),
  KEY gid (gid),
  KEY lid (lid),
  KEY m (m)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Groups-rights levels associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}groups_rights (
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  access text COMMENT 'Access data',
  PRIMARY KEY (gid,m),
  KEY gid (gid),
  KEY m (m)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Groups access rights';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}levels (
  id smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'Name',
  access text COMMENT 'Access data',
  locked tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Locked',
  priority smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Priority',
  PRIMARY KEY (id),
  KEY m (m)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Access levels';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}processes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  post_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Start date/time',
  query VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Process query',
  user_agent VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'User agent',
  ip VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'IP address',

  PRIMARY KEY (id),
  INDEX (post_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Processes';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}registry (
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT 'Key',
  `value` TEXT NULL DEFAULT NULL COMMENT 'Value',
  locked tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Locked',
  PRIMARY KEY (m,`name`),
  KEY m (m),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='System Registry';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users (
  id smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  login varchar(255) NOT NULL DEFAULT '' COMMENT 'Login',
  register_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Registration date',
  password_md5 varchar(255) NOT NULL DEFAULT '' COMMENT 'Password MD5',
  email varchar(255) NOT NULL DEFAULT '' COMMENT 'E-mail',
  last_name varchar(255) NOT NULL DEFAULT '' COMMENT 'Last name',
  first_name varchar(255) NOT NULL DEFAULT '' COMMENT 'First name',
  second_name varchar(255) NOT NULL DEFAULT '' COMMENT 'Second name',
  root tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Global admin',
  ip_filter varchar(255) NOT NULL DEFAULT '' COMMENT 'User IP filter',
  blocked tinyint(1) NOT NULL DEFAULT '0' COMMENT 'User is blocked',
  cache_rights text COMMENT 'Rights table serialize',
  prefs text COMMENT 'User preferences',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Users';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_groups_assoc (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  group_admin tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Group admin',
  PRIMARY KEY (uid,gid),
  KEY uid (uid),
  KEY gid (gid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Users-groups associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_levels_assoc (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  lid smallint(6) NOT NULL DEFAULT '0' COMMENT 'Level ID#',
  PRIMARY KEY (uid,m),
  KEY uid (uid),
  KEY lid (lid),
  KEY m (m)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Users-rights levels associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_rights (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  access text COMMENT 'Access data',
  PRIMARY KEY (uid,m),
  KEY uid (uid),
  KEY m (m)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Users access rights';

INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('installDate', NOW(), 1);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('cookieLifetime', '14', 0);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('minPasswordLength', '3', 0);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('rowsPerPage', '20', 0);