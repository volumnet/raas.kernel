<?php
/**
 * Стратегия типа данных "Изображение"
 */
namespace RAAS;

class ImageDatatypeStrategy extends FileDatatypeStrategy
{
    protected static $instance;

    public function validate($value, Field $field = null): bool
    {
        if (!is_scalar($value['tmp_name'] ?? null) || (trim($value['tmp_name'] ?? '') === '')) {
            return true;
        }
        parent::validate($value, $field);
        $type = @getimagesize($value['tmp_name']);
        if ($type && in_array($type[2], [IMAGETYPE_GIF, IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_WEBP])) {
            return true;
        } else {
            $mime = mime_content_type($value['tmp_name']);
            if (stristr($mime, 'svg')) {
                return true;
            }
        }
        throw new DatatypeImageTypeMismatchException();
    }
}
