<?php
/**
 * Файл теста рендерера HTML
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;
use SOME\BaseTest;

/**
 * Класс теста рендерера HTML
 */
#[CoversClass(PHPErrorLogParser::class)]
class PHPErrorLogParserTest extends BaseTest
{
    /**
     * Тест метода splitErrors
     * @param string $text Текст лога
     */
    #[TestWith([
        '[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 590 in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 631 in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 589 in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined variable $aaa in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code on line 3
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Fatal error:  Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code:3
Stack trace:
#0 stack trace entry 0
#1 stack trace entry 1
#2 stack trace entry 2
#3 stack trace entry 3
#4 stack trace entry 4
#5 stack trace entry 5
#6 stack trace entry 6
#7 stack trace entry 7
#8 stack trace entry 8
#9 stack trace entry 9
#10 stack trace entry 10
#11 stack trace entry 11
#12 stack trace entry 12
#13 stack trace entry 13
#14 stack trace entry 14
  thrown in d:/web/home/test/www/inc/commands/file1.php(546) : eval()\'d code on line 3
[13-Feb-2025 00:05:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:10:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:15:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:20:25 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:25:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:30:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:35:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:40:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:45:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:50:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 00:55:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:05:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:10:25 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:15:26 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:20:26 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:25:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:30:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:35:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:40:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65
[13-Feb-2025 01:45:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/web/home/test/www/cron/file2.class.php on line 65'
    ])]
    public function testSplitErrors(string $text)
    {
        $parser = new PHPErrorLogParser();

        $result = $parser->splitErrors($text);
        $this->assertCount(26, $result);

        $this->assertStringContainsString('Undefined variable $aaa', $result[3]);
        $this->assertStringContainsString('stack trace entry 4', $result[4]);
        $this->assertStringContainsString('Undefined array key 2', $result[5]);
    }


    /**
     * Тест метода parseError
     * @param string $error Текст ошибки
     * @param array $expected Ожидаемый результат
     */
    #[TestWith([
        '[13-Feb-2025 00:05:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:\\cron.php on line 65',
        [
            'file' => 'd:/cron.php',
            'line' => 65,
            'type' => 'Warning',
            'datetime' => '2025-02-13T00:05:23+05:00',
            'description' => 'Undefined array key 2',
        ],
    ])]
    #[TestWith([
        '[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 590 in d:/web/home/test/www/index.php(546) : eval()\'d code on line 2',
        [
            'file' => '/index.php',
            'line' => 546,
            'evalLine' => 2,
            'type' => 'Warning',
            'datetime' => '2025-02-13T00:00:27+05:00',
            'description' => 'Undefined array key 590',
        ],
    ])]
    #[TestWith([
        '[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Fatal error:  Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given in d:/web/home/test/www/index.php(123) : eval()\'d code:3
            Stack trace:
            #0 stack trace entry 0
            #1 stack trace entry 1
            #2 stack trace entry 2
            #3 stack trace entry 3
            #4 stack trace entry 4
            #5 stack trace entry 5
            #6 stack trace entry 6
            #7 stack trace entry 7
            #8 stack trace entry 8
            #9 stack trace entry 9
            #10 stack trace entry 10
            #11 stack trace entry 11
            #12 stack trace entry 12
            #13 stack trace entry 13
            #14 stack trace entry 14
              thrown in d:/web/home/test/www/inc/snippets/.htaccess(123) : eval()\'d code on line 3
              ',
        [
            'file' => '/inc/snippets/.htaccess',
            'line' => 123,
            'evalLine' => 3,
            'type' => 'Fatal error',
            'datetime' => '2025-02-13T00:00:27+05:00',
            'description' => 'Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given',
        ],
    ])]
    #[TestWith([
        '[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Fatal error:  Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given in d:/web/home/test/www/index.php(123) : eval()\'d code on line 3
            Stack trace:
            #0 stack trace entry 0
            #1 stack trace entry 1
            #2 stack trace entry 2
            #3 stack trace entry 3
            #4 stack trace entry 4
            #5 stack trace entry 5
            #6 stack trace entry 6
            #7 stack trace entry 7
            #8 stack trace entry 8
            #9 stack trace entry 9
            #10 stack trace entry 10
            #11 stack trace entry 11
            #12 stack trace entry 12
            #13 stack trace entry 13
            #14 stack trace entry 14
              thrown in d:/web/home/test/www/inc/snippets/.htaccess(123) : eval()\'d code on line 3
              ',
        [
            'file' => '/inc/snippets/.htaccess',
            'line' => 123,
            'evalLine' => 3,
            'type' => 'Fatal error',
            'datetime' => '2025-02-13T00:00:27+05:00',
            'description' => 'Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given',
        ],
    ])]
    public function testParseError(string $error, array $expected)
    {
        $parser = new PHPErrorLogParser();

        $result = $parser->parseError($error);

        $this->assertEquals($expected, $result);
    }


    /**
     * Тест метода mergeErrors()
     * @param array $errors Список ошибок
     * @param array $expected Ожидаемый результат
     */
    #[TestWith([
        [
            [
                'file' => 'd:/cron.php',
                'line' => 65,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:05:23+05:00',
                'description' => 'Undefined array key 2',
            ],
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 2,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Undefined array key 590',
            ],
            [
                'file' => '/inc/snippets/.htaccess',
                'line' => 123,
                'evalLine' => 3,
                'type' => 'Fatal error',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given',
            ],
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 2,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:00:28+05:00',
                'description' => 'Undefined array key 590',
            ],
        ],
        [
            [
                'file' => 'd:/cron.php',
                'line' => 65,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:05:23+05:00',
                'description' => 'Undefined array key 2',
                'count' => 1,
            ],
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 2,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:00:28+05:00',
                'description' => 'Undefined array key 590',
                'count' => 2,
            ],
            [
                'file' => '/inc/snippets/.htaccess',
                'line' => 123,
                'evalLine' => 3,
                'type' => 'Fatal error',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given',
                'count' => 1,
            ],
        ]
    ])]
    public function testMergeErrors(array $errors, array $expected)
    {
        $parser = new PHPErrorLogParser();

        $result = $parser->mergeErrors($errors);

        $this->assertEquals($expected, $result);
    }


    /**
     * Тест метода parse()
     * @param string $text Текст лога
     * @return array $expected Ожидаемое значение
     */
    #[TestWith([
        '[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 590 in d:/web/home/test/www/index.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 631 in d:/web/home/test/www/index.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 589 in d:/web/home/test/www/index.php(546) : eval()\'d code on line 2
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined variable $aaa in d:/web/home/test/www/index.php(546) : eval()\'d code on line 3
[13-Feb-2025 00:00:27 Asia/Yekaterinburg] PHP Fatal error:  Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given in d:/web/home/test/www/index.php(546) : eval()\'d code:3
Stack trace:
#0 stack trace entry 0
#1 stack trace entry 1
#2 stack trace entry 2
#3 stack trace entry 3
#4 stack trace entry 4
#5 stack trace entry 5
#6 stack trace entry 6
#7 stack trace entry 7
#8 stack trace entry 8
#9 stack trace entry 9
#10 stack trace entry 10
#11 stack trace entry 11
#12 stack trace entry 12
#13 stack trace entry 13
#14 stack trace entry 14
  thrown in d:/web/home/test/www/index.php(546) : eval()\'d code on line 3
[13-Feb-2025 00:05:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:10:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:15:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:20:25 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:25:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:30:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:35:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:40:23 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:45:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:50:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 00:55:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:00:27 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:05:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:10:25 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:15:26 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:20:26 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:25:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:30:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:35:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:40:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65
[13-Feb-2025 01:45:24 Asia/Yekaterinburg] PHP Warning:  Undefined array key 2 in d:/cron.php on line 65',
        [
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 2,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Undefined array key 590',
                'count' => 3,
            ],
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 3,
                'type' => 'Warning',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Undefined variable $aaa',
                'count' => 1,
            ],
            [
                'file' => '/index.php',
                'line' => 546,
                'evalLine' => 3,
                'type' => 'Fatal error',
                'datetime' => '2025-02-13T00:00:27+05:00',
                'description' => 'Uncaught TypeError: count(): Argument #1 ($value) must be of type Countable|array, null given',
                'count' => 1,
            ],
            [
                'file' => 'd:/cron.php',
                'line' => 65,
                'type' => 'Warning',
                'datetime' => '2025-02-13T01:45:24+05:00',
                'description' => 'Undefined array key 2',
                'count' => 21,
            ],
        ]
    ])]
    public function testParse(string $text, array $expected)
    {
        $parser = new PHPErrorLogParser();

        $result = $parser->parse($text);

        $this->assertEquals($expected, $result);
    }
}
