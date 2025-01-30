<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use InvalidArgumentException;

/**
 * Стратегия источника данных справочников
 */
class DictionarySourceStrategy extends SourceStrategy
{
    protected static $instance;

    /**
     * Распознает источник
     * @param Dictionary $source Источник
     * @throws InvalidArgumentException В случае, если источник - не справочник
     * @return array
     */
    public function parse($source): array
    {
        if (!($source instanceof Dictionary)) {
            throw new InvalidArgumentException('Source is not dictionary');
        }
        $result = [];
        foreach ($source->children as $child) {
            $key = $child->urn;
            $val = $child->name;
            $result[$key] = ['name' => $val];
            if ($parsedChildren = $this->parse($child)) {
                $result[$key]['children'] = $parsedChildren;
            }
        }
        return $result;
    }
}
