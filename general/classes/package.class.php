<?php
namespace RAAS\General;
use \RAAS\User as User;
use \RAAS\Group as Group;
use \RAAS\Level as Level;
use \RAAS\IRightsContext as IRightsContext;
use \RAAS\IContext as IContext;
use \RAAS\Application as Application;

class Package extends \RAAS\Package
{
    const rowsChunk = 1000;
    
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
            case 'alias': case 'Mid': case 'mid':
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
    
    public function admin_users_showlist(Group $Group, array $IN)
    {
        $Pages = new \SOME\Pages((isset($IN['page']) ? $IN['page'] : 1), $this->registryGet('rowsPerPage'));
        $from = $where = array();
        if (isset($IN['search_string'])) {
            $where[] = array("(login LIKE :search_string OR CONCAT(last_name, ' ', first_name, ' ', second_name) LIKE :search_string)", array(':search_string' => "%" . $this->SQL->escape_like($IN['search_string']) . "%"));
        }
        if ($Group->id && (!isset($IN['search_string']) || isset($IN['group_only']))) {
            $from[] = User::_dbprefix() . "users_groups_assoc AS tUGA ON tUGA.uid = User.id";
            $where[] = "tUGA.gid = " . (int)$Group->id;
        }
        switch (isset($IN['sort']) ? $IN['sort'] : null) {
            case 'email': case 'last_name':
                $sort = "User." . $_GET['sort'];
                break;
            default:
                $sort = "User.login";
                break;
        }
        if (strtolower(isset($IN['order']) ? $IN['order'] : null) == 'desc') {
            $order = 'DESC';
        } else {
            $order = 'ASC';
        }
        $Set = User::getSet(array('from' => $from, 'where' => $where, 'orderBy' => $sort . " " . $order), $Pages);
        
        $GSet = $Group->getChildSet('children');
        return array('Set' => $Set, 'Pages' => $Pages, 'GSet' => $GSet);
    }

    public function checkLoginExists($login, $id = 0)
    {
        $SQL_query = "SELECT COUNT(*) FROM " . User::_tablename() . " WHERE login = ?";
        $SQL_bind = array($login);
        if ($id) {
            $SQL_query .= " AND id != ?";
            $SQL_bind[] = (int)$id;
        }
        $SQL_result = $this->SQL->getvalue(array($SQL_query, $SQL_bind));
        return (bool)$SQL_result;
    }

    public function getAvailableUpdates()
    {
        $url = $this->application->updateURL . '?lang=' . $this->application->view->language;
        $data = array();
        foreach ($this->application->packages as $p => $Pack) {
            $data['m'][] = $p;
            foreach ($Pack->modules as $m => $Mod) {
                $data['m'][] = $p . '.' . $m;
            }
        }
        if ($data) {
            $url .= '&' . http_build_query($data);
        }
        if (!($text = @file_get_contents($url, 0, $this->application->networkContext))) {
            return array('failedToConnect' => true);
        }
        $DATA = array();
        if (!$sxe = new \SimpleXMLElement($text)) {
            return array('failedToConnect' => true);
        }        
        foreach ($sxe->module as $module) {
            if (!(string)$module['error']) {
                $Context = null;
                if ($module['alias'] == '/') {
                    $Context = $this->application;
                } elseif (!strstr($module['alias'], '.')) {
                    $Context = $this->application->packages[(string)$module['alias']];
                } else {
                    list($p, $m) = explode('.', (string)$module['alias']);
                    $Context = $this->application->packages[$p]->modules[$m];
                }
                if ($Context && ((int)$Context->versionTime < (int)$module->versionTime)) {
                    $DATA[(string)$module['alias']] = (int)$module->versionTime;
                }
            }
        }
        return array('modules' => $DATA);
    }
    
    public function downloadUpdate(IContext $Context)
    {
        $url = $this->application->updateURL . '?action=download&lang=' . $this->application->view->language . '&m=' . ($Context instanceof Application ? '/' : $Context->mid);
        if (!($text = file_get_contents($url, 0, $this->application->networkContext))) {
            return false;
        }
        $file = tempnam(sys_get_temp_dir(), 'RAAS');
        @file_put_contents($file, $text);
        return $file;
    }
    
    public function backupSQL()
    {
        header('Content-Type: text/plain;encoding=UTF-8');
        header('Content-Disposition: attachment; filename="' . $this->dbname . '.sql"');

        $SQL_query = "SHOW TABLES";
        $tables = $this->SQL->getcol($SQL_query);
        for ($i = 0; $i < count($tables); $i++) { 
            $tablename = $tables[$i];
            if ($i) {
                echo "\n\n" . 
                     "-- *************************************************************\n";
            }
            echo "-- \n" .
                 "-- Table structure: " . $tablename . "\n" .
                 "-- \n" .
                 "DROP TABLE IF EXISTS " . $tablename . ";\n";
            $SQL_query = "SHOW CREATE TABLE " . $tablename;
            $SQL_result = $this->SQL->getline($SQL_query);
            echo $SQL_result['Create Table'] . ";";
            $SQL_query = "SELECT * FROM " . $tablename;
            $SQL_result = $this->SQL->get($SQL_query);
            $SQL_query = "";
            for ($j = 0; $j < count($SQL_result); $j += self::rowsChunk) {
                $SQL_query .= $this->SQL->export($tablename, array_slice($SQL_result, $j, self::rowsChunk), false) . ";\n";
            }
            if (trim($SQL_query)) {
                echo "\n\n" .
                     "-- \n" .
                     "-- Table data: " . $tablename . "\n" .
                     "-- \n";
                echo $SQL_query;
            }
        }
    }
    
    public function backupFiles()
    {
        $tmpname = tempnam(sys_get_temp_dir(), '');
        $z = new \SOME\ZipArchive();
        $z->open($tmpname, \SOME\ZipArchive::CREATE);
        $dir = \SOME\File::scandir($this->application->baseFilesDir);
        foreach ($dir as $f) {
            $z->addFile($this->application->baseFilesDir . '/' . $f, $f);
        }
        $z->close();
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $_SERVER['HTTP_HOST'] . '.zip"');
        echo file_get_contents($tmpname);
    }
}