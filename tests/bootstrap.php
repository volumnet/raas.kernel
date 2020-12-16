<?php
namespace RAAS;

define('RAAS_BASEDIR', __DIR__ . '/..');
$_SERVER['HTTP_HOST'] = 'localhost';
$_SERVER['HTTPS'] = 'off';
require __DIR__ . '/../vendor/autoload.php';
Application::i()->run('test');
