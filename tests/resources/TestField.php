<?php
/**
 * Файл тестового поля (мок для CustomField)
 */
namespace RAAS;

use SOME\SOME;

/**
 * Класс тестового поля
 * @property-read self $parent Родительская сущность
 * @property-read self[] $parents Родительские сущности
 * @property-read self[] $children Дочерние сущности
 */
class TestField extends CustomField
{
    const DATA_TABLE = 'tmp_data';

    const DICTIONARY_CLASS = CustomDictionary::class;

    protected static $tablename = 'tmp_fields';

    protected static $defaultOrderBy = "priority";
}
