<?php
/**
 * Файл трейта работы с виджетами
 */
namespace RAAS;

/**
 * Трейт работы с виджетами
 */
trait WidgetTrait
{
    /**
     * Отрабатывает виджет с данными
     * @param string $file Файл виджета
     * @param array $data Данные для передачи в виджет
     * @return mixed
     */
    public function widget($file, array $data = [])
    {
        extract($data);
        $VIEW = $this;
        $result = @include $file;
        return $result;
    }
}
