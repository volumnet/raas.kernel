<?php
/**
 * Перемещение сущности
 * @param array $menu Структура меню
 * @param string? $hint Подсказка
 */
namespace RAAS;

?>
<p><?php echo htmlspecialchars($hint ?? CHOOSE_NEW_PARENT)?>:</p>
<menu-move :menu="<?php echo htmlspecialchars(json_encode($menu))?>"></menu-move>

