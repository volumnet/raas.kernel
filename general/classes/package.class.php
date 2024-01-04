<?php
/**
 * Пакета "Главная"
 */
declare(strict_types=1);

namespace RAAS\General;

use SOME\Pages;
use RAAS\Application;
use RAAS\DBBackup;
use RAAS\FilesBackup;
use RAAS\Group;
use RAAS\User;

/**
 * Класс пакета "Главная"
 */
class Package extends \RAAS\Package
{
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'baseDir':
                return $this->application->systemDir . '/general';
                break;
            case 'systemDir':
                return $this->baseDir;
                break;
            case 'alias':
            case 'Mid':
            case 'mid':
                return '/';
                break;
            case 'version':
                return Application::i()->version;
                break;
            case 'versionTime':
                return Application::i()->versionTime;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function initModules()
    {
        return;
    }


    /**
     * Возвращает данные по списку пользователей
     * @param Group $group Группа для фильтрации
     * @param array $in <pre><code>[
     *     'page' =>? int Номер страницы постраничной разбивки,
     *     'search_string' =>? string Поисковая строка,
     *     'group_only' =>? bool Искать только по группе,
     *     'sort' =>? string Поле для сортировки,
     *     'order' =>? 'asc'|'desc' Направление сортировки
     * ]</code></pre> Входные данные
     */
    public function admin_users_showlist(Group $group, array $in)
    {
        $pages = new Pages((isset($in['page']) ? $in['page'] : 1), Application::i()->registryGet('rowsPerPage'));
        $from = $where = [];
        if (isset($in['search_string'])) {
            $where[] = [
                "(login LIKE :search_string OR CONCAT(last_name, ' ', first_name, ' ', second_name) LIKE :search_string)",
                [':search_string' => "%" . $this->SQL->escape_like($in['search_string']) . "%"]
            ];
        }
        if ($group->id && (!isset($in['search_string']) || isset($in['group_only']))) {
            $from[] = User::_dbprefix() . "users_groups_assoc AS tUGA ON tUGA.uid = User.id";
            $where[] = "tUGA.gid = " . (int)$group->id;
        }
        switch (isset($in['sort']) ? $in['sort'] : null) {
            case 'email':
            case 'last_name':
                $sort = "User." . $_GET['sort'];
                break;
            default:
                $sort = "User.login";
                break;
        }
        if (strtolower($in['order'] ?? '') == 'desc') {
            $order = 'DESC';
        } else {
            $order = 'ASC';
        }
        $set = User::getSet(['from' => $from, 'where' => $where, 'orderBy' => $sort . " " . $order], $pages);

        $gSet = $group->getChildSet('children');
        return ['Set' => $set, 'Pages' => $pages, 'GSet' => $gSet];
    }


    /**
     * Проверяет, существует ли пользователь с таким именем
     * @param string $login Логин для поиска
     * @param int $ignoreId Игнорировать ID# (для поиска пользователей кроме текущего)
     * @return bool
     */
    public function checkLoginExists($login, $ignoreId = 0)
    {
        $sqlQuery = "SELECT COUNT(*) FROM " . User::_tablename() . " WHERE login = ?";
        $sqlBind = [$login];
        if ($ignoreId) {
            $sqlQuery .= " AND id != ?";
            $sqlBind[] = (int)$ignoreId;
        }
        $sqlResult = $this->SQL->getvalue([$sqlQuery, $sqlBind]);
        return (bool)$sqlResult;
    }


    /**
     * Генерирует в stdout бэкап SQL-базы в виде дампа
     */
    public function backupSQL()
    {
        $tmpname = tempnam(sys_get_temp_dir(), '');
        $fp = fopen($tmpname, 'w+');
        DBBackup::writeSQLDump($fp);
        fclose($fp);
        header('Content-Type: text/plain;encoding=UTF-8');
        header('Content-Disposition: attachment; filename="' . date('Y-m-d H-i') . ' ' . $this->dbname . '.sql"');
        readfile($tmpname);
        unlink($tmpname);
        exit;
    }

    /**
     * Генерирует в stdout бэкап файлов
     */
    public function backupFiles()
    {
        $tmpname = tempnam(sys_get_temp_dir(), '');
        FilesBackup::writeArchive($tmpname);
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . date('Y-m-d H-i') . ' ' . $_SERVER['HTTP_HOST'] . '.zip"');
        readfile($tmpname);
    }
}
