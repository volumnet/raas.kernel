<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Команда резервного копирования
 */
class BackupCommand extends Command
{
    /**
     * Создает резервную копию, очищает старые (в случае БД)
     * @param string $type Тип резервной копии ('sql'|'files'|'clear' (только для очистки БД))
     * @param int $expirationPeriod Срок хранения копий БД, дней, 0 - не ограничено
     * @param string $hashTag Хэш-тег для фильтрации удаления
     */
    public function process($type = 'sql', $expirationPeriod = 0, $hashTag = '')
    {
        switch ($type) {
            case 'sql':
                $this->createSQL($hashTag);
                // nobreak;
            case 'clear':
                if ((int)$expirationPeriod > 0) {
                    $this->clearOldSQL($expirationPeriod, $hashTag);
                }
                break;
            case 'files':
                $this->createFiles();
                break;
        }
    }


    /**
     * Создает резервную копию базы данных
     * @param string $hashTag Хэш-тег для фильтрации удаления
     */
    public function createSQL($hashTag = '')
    {
        $backup = new DBBackup();
        $backup->preserveFromDeletion = false;
        $backup->name = $this->controller->view->_('AUTOMATIC_BACKUP');
        if ($hashTag) {
            $backup->name .= ' (#' . $hashTag . ')';
        }
        $backup->commit();
        $this->controller->doLog('Резервная копия БД создана');
    }


    /**
     * Создает резервную копию файлов (инкрементарную, если найдена полная,
     * либо полную в противном случае)
     */
    public function createFiles()
    {
        $lastBackup = FilesBackup::getLastBackup();
        if ($lastBackup) {
            $backup = new FilesIncBackup();
        } else {
            $backup = new FilesBackup();
        }
        $backup->name = $this->controller->view->_('AUTOMATIC_BACKUP');
        $this->controller->doLog(
            'Резервная копия файлов (' .
            ($lastBackup ? 'инкрементарная' : 'полная') .
            ') создана'
        );
        $backup->preserveFromDeletion = true;
        $backup->commit();
    }


    /**
     * Очищает старые копии БД
     * @param int $expirationPeriod Срок хранения копий БД, дней, 0 - не ограничено
     */
    public function clearOldSQL($expirationPeriod, $hashTag = '')
    {
        if ($expirationPeriod <= 0) {
            return;
        }
        $expirationDate = date('Y-m-d H-i-s', time() - $expirationPeriod * 86400);
        $set = array_values(array_filter(
            Backup::load(),
            function ($x) use ($expirationDate, $hashTag) {
                return ($x instanceof DBBackup) &&
                    !$x->preserveFromDeletion &&
                    ($x->postDate <= $expirationDate) &&
                    (!$hashTag || stristr($x->name, '(#' . $hashTag . ')'));
            }
        ));
        foreach ($set as $backup) {
            DBBackup::delete($backup);
            $this->controller->doLog(
                'Резервная копия ' . $backup->id .
                ' от ' . $backup->dateTime->format('Y-m-d H:i:s') . ' удалена'
            );
        }
    }
}
