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
  KEY pid (pid)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Attachments';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}groups (
  id smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  pid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Parent group ID#',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'Name',
  description text COMMENT 'Description',
  PRIMARY KEY (id),
  KEY pid (pid)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Groups of users';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}groups_levels_assoc (
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  lid smallint(6) NOT NULL DEFAULT '0' COMMENT 'Level ID#',
  PRIMARY KEY (gid,m),
  KEY gid (gid),
  KEY lid (lid),
  KEY m (m)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Groups-rights levels associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}groups_rights (
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  access text COMMENT 'Access data',
  PRIMARY KEY (gid,m),
  KEY gid (gid),
  KEY m (m)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Groups access rights';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}levels (
  id smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'Name',
  access text COMMENT 'Access data',
  locked tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Locked',
  priority smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Priority',
  PRIMARY KEY (id),
  KEY m (m)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Access levels';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}registry (
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT 'Key',
  `value` TEXT NULL DEFAULT NULL COMMENT 'Value',
  locked tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Locked',
  PRIMARY KEY (m,`name`),
  KEY m (m),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='System Registry';

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Users';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_groups_assoc (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  gid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'Group ID#',
  group_admin tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Group admin',
  PRIMARY KEY (uid,gid),
  KEY uid (uid),
  KEY gid (gid)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Users-groups associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_levels_assoc (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  lid smallint(6) NOT NULL DEFAULT '0' COMMENT 'Level ID#',
  PRIMARY KEY (uid,m),
  KEY uid (uid),
  KEY lid (lid),
  KEY m (m)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Users-rights levels associations';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_log (
  uid smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'User ID#',
  last_activity_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Last activity date',
  ip varchar(255) NOT NULL DEFAULT '' COMMENT 'IP Address',
  package varchar(32) NOT NULL DEFAULT '' COMMENT 'Package',
  module varchar(32) NOT NULL DEFAULT '' COMMENT 'Module',
  sub varchar(32) NOT NULL DEFAULT '' COMMENT 'Submodule',
  action_name varchar(32) NOT NULL DEFAULT '' COMMENT 'Action',
  id int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Element ID#',
  PRIMARY KEY (uid,last_activity_date),
  KEY uid (uid),
  KEY last_activity_date (last_activity_date),
  KEY package (package),
  KEY module (module),
  KEY sub (sub),
  KEY action_name (action_name),
  KEY id (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Users activity log';

CREATE TABLE IF NOT EXISTS {$DBPREFIX$}users_rights (
  uid smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT 'User ID#',
  m varchar(32) NOT NULL DEFAULT '' COMMENT 'MID',
  access text COMMENT 'Access data',
  PRIMARY KEY (uid,m),
  KEY uid (uid),
  KEY m (m)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Users access rights';

INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('installDate', NOW(), 1);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('cookieLifetime', '14', 0);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('minPasswordLength', '3', 0);
INSERT IGNORE INTO {$DBPREFIX$}registry (name, value, locked) VALUES ('rowsPerPage', '20', 0);