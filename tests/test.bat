CHCP 65001 
SET XDEBUG_CONFIG="idekey=session_name" 
SET "COMPOSER_PROCESS_TIMEOUT=3600" 
phpunit --testsuite %1
