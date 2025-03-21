<?php
/**
 * Таблица
 * @param Table $Table Таблица
 * @param bool? $insideForm Таблица находится уже внутри формы (ей не нужна своя форма)
 * @param string? $pagesHash Хэш-тег для постраничной разбивки
 */
namespace RAAS;

echo $Table->renderFull($insideForm ?? false, $pagesHash ?? '');
