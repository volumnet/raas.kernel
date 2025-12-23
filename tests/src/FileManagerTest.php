<?php

/**
 * Файл теста файлового менеджера
 */

namespace RAAS;

use Exception;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\TestWith;
use SOME\BaseTest;
use SOME\File;
use SOME\Text;
use RAAS\CMS\Package as CMSPackage;
use RAAS\CMS\View_Web as CMSViewWeb;

/**
 * Класс теста файлового менеджера
 */
#[CoversClass(FileManager::class)]
class FileManagerTest extends BaseTest
{
    public static $tables = [
        'cms_access',
        'cms_access_blocks_cache',
        'cms_access_materials_cache',
        'cms_access_pages_cache',
        'cms_blocks',
        'cms_blocks_html',
        'cms_blocks_material',
        'cms_blocks_pages_assoc',
        'cms_fields',
        'cms_groups',
        'cms_material_types',
        'cms_material_types_affected_pages_for_materials_cache',
        'cms_material_types_affected_pages_for_self_cache',
        'cms_materials',
        'cms_materials_affected_pages_cache',
        'cms_materials_pages_assoc',
        'cms_pages',
        'cms_shop_cart_types',
        'cms_snippet_folders',
        'cms_snippets',
        'cms_users',
        'cms_users_groups_assoc',
        'registry',
    ];

    /**
     * Оригинальный контекст приложения
     */
    protected static IContext|null $originalContext;

    /**
     * Оригинальное значение глобальной переменной $_GET
     */
    protected array $originalGet = [];

    /**
     * Оригинальное значение глобальной переменной $_POST
     */
    protected array $originalPost = [];

    /**
     * Оригинальное значение глобальной переменной $_SERVER
     */
    protected array $originalServer = [];

    /**
     * Оригинальное значение глобальной переменной $_FILES
     */
    protected array $originalFiles = [];


    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        static::$originalContext = Application::i()->activePackage;
        Application::i()->activePackage = CMSPackage::i();

    }


    public static function tearDownAfterClass(): void
    {
        Application::i()->activePackage = static::$originalContext;
        parent::tearDownAfterClass();

    }


    protected function setUp(): void
    {
        parent::setUp();
        @mkdir(Application::i()->baseDir . '/files/cms/common/image/design', 0777);
        @mkdir(Application::i()->baseDir . '/files/cms/common/image/test2', 0777);
        touch(Application::i()->baseDir . '/files/cms/common/image/design/nophoto.jpg');
        touch(Application::i()->baseDir . '/files/cms/common/image/design/.htaccess');
        touch(Application::i()->baseDir . '/files/cms/common/image/aaa.php');
        touch(Application::i()->baseDir . '/files/cms/common/image/design/aaa.php');
        $this->originalGet = $_GET;
        $this->originalPost = $_POST;
        $this->originalServer = $_SERVER;
        $this->originalFiles = $_FILES;
    }


    protected function tearDown(): void
    {
        $_GET = $this->originalGet;
        $_POST = $this->originalPost;
        $_SERVER = $this->originalServer;
        $_FILES = $this->originalFiles;
        @unlink(Application::i()->baseDir . '/files/cms/common/image/aaa.php');
        @unlink(Application::i()->baseDir . '/files/cms/common/image/design/aaa.php');
        @unlink(Application::i()->baseDir . '/files/cms/common/image/design/.htaccess');
        @unlink(Application::i()->baseDir . '/files/cms/common/image/design/nophoto.jpg');
        @unlink(Application::i()->baseDir . '/files/cms/common/image/design/nophoto2.jpg');
        @unlink(Application::i()->baseDir . '/files/cms/common/image/test2/nophoto.jpg');
        @rmdir(Application::i()->baseDir . '/files/cms/common/image/design');
        @rmdir(Application::i()->baseDir . '/files/cms/common/image/design/test');
        @rmdir(Application::i()->baseDir . '/files/cms/common/image/test');
        @rmdir(Application::i()->baseDir . '/files/cms/common/image/test2');
        parent::tearDown();
    }


    /**
     * Проверка свойства $context
     */
    public function testGetContext()
    {
        $filemanager = new FileManager(true);
        $this->assertEquals(CMSPackage::i(), $filemanager->context);
    }


    /**
     * Проверка свойства $view
     */
    public function testGetView()
    {
        $filemanager = new FileManager(true);
        $this->assertEquals(CMSViewWeb::i(), $filemanager->view);
    }


    /**
     * Проверка свойства $rootDir
     */
    public function testGetRootDir()
    {
        $filemanager = new FileManager(true);
        $this->assertTrue(is_dir(realPath($filemanager->rootDir)));
        $this->assertEquals(
            realpath(Application::i()->baseDir . '/files/cms/common'),
            realpath($filemanager->rootDir)
        );
    }


    /**
     * Проверка свойства $rootUrl
     */
    public function testGetRootUrl()
    {
        $filemanager = new FileManager();

        $this->assertEquals('/files/cms/common', $filemanager->rootUrl);
    }


    /**
     * Проверка метода getPath()
     * @param string $path Путь для проверки
     * @param string $expected Ожидаемое значение, либо текст исключения
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     */
    #[TestWith(['/image', '/files/cms/common/image'])]
    #[TestWith(['image/', '/files/cms/common/image'])]
    #[TestWith(['image', '/files/cms/common/image'])]
    #[TestWith(['image/design/nophoto.jpg', '/files/cms/common/image/design/nophoto.jpg'])]
    #[TestWith(['/file/', '/files/cms/common/file'])]
    #[TestWith(['', 'FILEMANAGER_PATH_NOT_FOUND', 404])]
    #[TestWith(['image/../aaa/bbb', 'FILEMANAGER_UPPER_DIRS_NOT_ALLOWED', 403])]
    #[TestWith(['media', 'FILEMANAGER_PATH_NOT_FOUND', 404])]
    #[TestWith(['image/design/.htaccess', 'ACCESS_DENIED', 403])]
    #[TestWith(['image/aaa.php', 'ACCESS_DENIED', 403])]
    #[TestWith(['image/aaa.jpg', 'FILEMANAGER_PATH_NOT_FOUND', 404])]
    public function testGetPath(
        string $path,
        string $expected,
        int $expectedExceptionCode = 0,
    ) {

        $filemanager = new FileManager();
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expected);
        }

        $result = $filemanager->getPath($path);

        if (!$expectedExceptionCode) {
            $this->assertEquals(realpath(Application::i()->baseDir . $expected), $result);
        }
    }


    /**
     * Тест метода validateName()
     * @param string $path Родительский путь
     * @param string $name Название папки/файла
     * @param bool $isDir Является ли папкой
     * @param bool $findName Найти новое имя, если это занято
     * @param string $expected Ожидаемое значение, либо текст исключения
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     */
    #[TestWith(['image', '', true, false, 'DIRNAME_REQUIRED', 400])]
    #[TestWith(['image', '', false, false, 'FILENAME_REQUIRED', 400])]
    #[TestWith(['image', 'aaa/bbb', false, false, 'FILEMANAGER_INVALID_DIR_OR_FILE_NAME', 400])]
    #[TestWith(['image', '.htaccess', false, false, 'ACCESS_DENIED', 403])]
    #[TestWith(['image', 'aaa.php', false, false, 'ACCESS_DENIED', 403])]
    #[TestWith(['image', 'Картинка.jpg', false, false, 'image/kartinka.jpg'])]
    #[TestWith(['image/design', 'nophoto.jpg', false, true, 'image/design/nophoto_1.jpg'])]
    public function testValidateName(
        string $path,
        string $name,
        bool $isDir,
        bool $findName,
        string $expected,
        int $expectedExceptionCode = 0
    ) {
        $filemanager = new FileManager();
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expected);
        }

        $realPath = Application::i()->baseDir . '/files/cms/common/' . $path;
        $result = $filemanager->validateName($realPath, $name, $isDir, $findName);

        if (!$expectedExceptionCode) {
            $this->assertEquals(Application::i()->baseDir . '/files/cms/common/' . $expected, $result);
        }
    }


    /**
     * Тест метода dirHasSubfolders()
     * @param string $path Путь к папке (или файлу)
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['image/design/nophoto.jpg', false])]
    #[TestWith(['image/design', false])]
    #[TestWith(['image', true])]
    #[TestWith(['image/', true])]
    public function testDirHasSubfolders(string $path, bool $expected)
    {
        $filemanager = new FileManager();
        $realPath = Application::i()->baseDir . '/files/cms/common/' . $path;
        $result = $filemanager->dirHasSubfolders($realPath);
        $this->assertEquals($expected, $result);
    }


    /**
     * Тест метода pathInfo()
     * @param string $path Путь
     * @param bool $extended Расширенный вариант
     * @param array $expected Ожидаемая запись
     */
    #[TestWith(['image/design/nophoto.jpg', false, [
        'type' => 'file',
        'name' => 'nophoto.jpg',
        'path' => 'image/design/nophoto.jpg',
        'url' => '/files/cms/common/image/design/nophoto.jpg',
        'size' => 0
    ]])]
    #[TestWith([
        'image/design/nophoto.jpg',
        true,
        [
            'type' => 'file',
            'name' => 'nophoto.jpg',
            'path' => 'image/design/nophoto.jpg',
            'url' => '/files/cms/common/image/design/nophoto.jpg',
            'size' => 0,
            'datetime' => '0000-00-00 00:00:00',
            'datetimeFormatted' => '00.00.0000 00:00:00',
        ]
    ])]
    #[TestWith(['image/design', false, [
        'type' => 'dir',
        'name' => 'design',
        'path' => 'image/design',
        'url' => '/files/cms/common/image/design/',
        'hasSubfolders' => false,
    ]])]
    #[TestWith([
        'image/design',
        true,
        [
            'type' => 'dir',
            'name' => 'design',
            'path' => 'image/design',
            'url' => '/files/cms/common/image/design/',
            'hasSubfolders' => false,
            'datetime' => '0000-00-00 00:00:00',
            'datetimeFormatted' => '00.00.0000 00:00:00',
            'children' => [[
                'type' => 'file',
                'name' => 'nophoto.jpg',
                'path' => 'image/design/nophoto.jpg',
                'url' => '/files/cms/common/image/design/nophoto.jpg',
                'size' => 0,
                'datetime' => '0000-00-00 00:00:00',
                'datetimeFormatted' => '00.00.0000 00:00:00',
            ]]
        ]
    ])]
    public function testPathInfo(string $path, bool $extended, array $expected)
    {
        $filemanager = new FileManager();

        $result = $filemanager->pathInfo(Application::i()->baseDir . '/files/cms/common/' . $path, $extended);
        // var_dump($result);

        if (isset($result['datetime'])) {
            $result['datetime'] = preg_replace('/\\d/umis', '0', $result['datetime']);
            $result['datetimeFormatted'] = preg_replace('/\\d/umis', '0', $result['datetimeFormatted']);
        }
        if (isset($result['children'][0]['datetime'])) {
            $result['children'][0]['datetime'] = preg_replace('/\\d/umis', '0', $result['children'][0]['datetime']);
            $result['children'][0]['datetimeFormatted'] = preg_replace('/\\d/umis', '0', $result['children'][0]['datetimeFormatted']);
        }
        $this->assertEquals($expected, array_intersect_key($result, $expected));
    }


    /**
     * Тест метода makeDir()
     * @param string $path Путь
     * @param string $dirName Имя папки
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     * @param string $expectedExceptionText Ожидаемый текст исключения
     */
    #[TestWith(['image/design', 'test'])]
    #[TestWith(['image/nophoto.jpg', 'test', 400, 'FILEMANAGER_PATH_IS_NOT_DIR'])]
    #[TestWith(['image', 'design', 403, 'FILEMANAGER_DIR_OR_FILE_ALREADY_EXISTS'])]
    public function testMakeDir(
        string $path,
        string $dirName,
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expectedExceptionText);
        }
        $filemanager = new FileManager();

        $fullPath = Application::i()->baseDir . '/files/cms/common/' .  $path;

        if (!$expectedExceptionCode) {
            $this->assertFalse(is_dir($fullPath . '/' . $dirName));
        }

        $result = $filemanager->makeDir($fullPath, $dirName);

        if (!$expectedExceptionCode) {
            $this->assertTrue(is_dir($fullPath . '/' . $dirName));
            @rmdir($fullPath . '/' . $dirName);
        }
    }


    /**
     * Тест метода delete()
     * @param string $path Путь
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     * @param string $expectedExceptionText Ожидаемый текст исключения
     */
    #[TestWith(['image/aaa.php'])]
    #[TestWith(['image/test2'])]
    #[TestWith(['image/design', 403, 'FILEMANAGER_CANNOT_DELETE_DIR_NOT_EMPTY'])]
    #[TestWith(['image/abc', 403, 'ACCESS_DENIED'])]
    public function testDelete(
        string $path,
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expectedExceptionText);
        }
        $filemanager = new FileManager();
        $fullPath = Application::i()->baseDir . '/files/cms/common/' .  $path;

        if (!$expectedExceptionCode) {
            if (!file_exists($fullPath)) {
                touch($fullPath);
            }
        }

        $result = $filemanager->delete($fullPath);

        if (!$expectedExceptionCode) {
            $this->assertFalse(file_exists($fullPath));
        }
    }


    /**
     * Тест метода delete()
     * @param string $path Путь
     * @param string $newName Новое имя
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     * @param string $expectedExceptionText Ожидаемый текст исключения
     */
    #[TestWith(['image/design/nophoto.jpg', 'nophoto2.jpg'])]
    #[TestWith(['image', 'image2', 403, 'FILEMANAGER_CANNOT_RENAME_OR_MOVE_ROOT_DIR'])]
    #[TestWith(['image/design', 'test2', 403, 'ACCESS_DENIED'])]
    public function testRename(
        string $path,
        string $newName,
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expectedExceptionText);
        }
        $filemanager = new FileManager();
        $fullPath = Application::i()->baseDir . '/files/cms/common/' .  $path;
        $fullDir = dirname($fullPath);
        $fullNewPath = $fullDir . '/' . $newName;
        if (!$expectedExceptionCode) {
            $this->assertTrue(file_exists($fullPath));
            $this->assertFalse(file_exists($fullNewPath));
        }

        $filemanager->rename($fullPath, $newName);

        if (!$expectedExceptionCode) {
            $this->assertFalse(file_exists($fullPath));
            $this->assertTrue(file_exists($fullNewPath));
        }
    }


    /**
     * Тест метода delete()
     * @param string $path Путь
     * @param string $newPath Новый путь
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     * @param string $expectedExceptionText Ожидаемый текст исключения
     */
    #[TestWith(['image/design/nophoto.jpg', 'image/test2'])]
    #[TestWith(['image', 'file', 403,'FILEMANAGER_CANNOT_RENAME_OR_MOVE_ROOT_DIR'])]
    #[TestWith(['image/design/nophoto.jpg', 'image/nophoto.jpg', 400, 'FILEMANAGER_TARGET_PATH_IS_NOT_DIR'])]
    #[TestWith(['image/design/aaaa.jpg', 'image', 403, 'ACCESS_DENIED'])]
    public function testMove(
        string $path,
        string $newPath,
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expectedExceptionText);
        }
        $filemanager = new FileManager();

        $fullPath = Application::i()->baseDir . '/files/cms/common/' .  $path;
        $basename = basename($path);
        $fullNewPath = Application::i()->baseDir . '/files/cms/common/' .  $newPath;

        if (!$expectedExceptionCode) {
            $this->assertTrue(file_exists($fullPath));
            $this->assertFalse(file_exists($fullNewPath . '/' . $basename));
        }

        $filemanager->move($fullPath, $fullNewPath);

        if (!$expectedExceptionCode) {
            $this->assertFalse(file_exists($fullPath));
            $this->assertTrue(file_exists($fullNewPath . '/' . $basename));
            File::unlink($fullNewPath . '/' . $basename);
        }
    }


    /**
     * Тест метода upload()
     * @param string $path Путь к папке
     * @param array $files <pre><code>array<
     *     'tmp_name' => string,
     *     'name' => string,
     * ></code></pre> Данные загружаемых файлов
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     * @param string $expectedExceptionText Ожидаемый текст исключения
     */
    #[TestWith([
        'image',
        [
            ['name' => 'product1.jpg',
                'tmp_name' => 'd:/web/home/libs/raas.cms.shop/resources/fish/products/1.jpg'
            ],
            [
                'name' => 'product2.jpg',
                'tmp_name' => 'd:/web/home/libs/raas.cms.shop/resources/fish/products/2.jpg'
            ],
            [
                'name' => 'arboretum_tree_rings.jpg',
                'tmp_name' => 'd:/Users/Александр/Pictures/fish/arboretum_tree_rings.jpg',
            ],
            [
                'name' => 'favicon.svg',
                'tmp_name' => 'd:/web/home/libs/raas.cms/resources/fish/favicon.svg',
            ],
        ]
    ])]
    #[TestWith([
        'file',
        [['name' => 'test.doc', 'tmp_name' => 'd:/web/home/libs/raas.cms.shop/resources/fish/test.doc']]
    ])]
    #[TestWith([
        'image',
        [['name' => 'test.doc', 'tmp_name' => 'd:/web/home/libs/raas.cms.shop/resources/fish/test.doc']],
        400,
        'FILEMANAGER_FILE_IS_NOT_IMAGE'
    ])]
    #[TestWith([
        'image',
        [
            ['name' => 'test.doc', 'tmp_name' => 'd:/web/home/libs/raas.cms.shop/resources/fish/test.doc'],
            ['name' => 'favicon.svg', 'tmp_name' => 'd:/web/home/libs/raas.cms/resources/fish/favicon.svg'],
        ],
        400,
        'FILEMANAGER_CANNOT_UPLOAD_ONE_OR_MORE_FILES'
    ])]
    public function testUpload(
        string $path,
        array $files,
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        if ($expectedExceptionCode) {
            $this->expectException(Exception::class);
            $this->expectExceptionCode($expectedExceptionCode);
            $this->expectExceptionMessage($expectedExceptionText);
        }
        $realPath = Application::i()->baseDir . '/files/cms/common/' . $path;
        foreach ($files as $file) {
            $filename = $file['name'];
            $realFilePath = $realPath . '/' . $filename;
            @unlink($realFilePath);
            @unlink(str_replace('.jpeg', '.jpg', $realFilePath));
        }
        $filemanager = new FileManager();
        $filemanager->debug = true;
        // var_dump($files);
        $filemanager->upload($realPath, $files);

        if (!$expectedExceptionCode) {
            foreach ($files as $file) {
                $filename = $file['name'];
                $realFilePath = $realPath . '/' . $filename;
                // var_dump($realFilePath, is_file($realFilePath));
                $this->assertTrue(is_file($realFilePath));
                if (in_array(pathinfo($filename, PATHINFO_EXTENSION), ['jpg', 'gif', 'png'])) {
                    $oldSize = getimagesize($file['tmp_name']);
                    $newSize = getimagesize($realFilePath);
                    // var_dump($file['name'], $oldSize[0], $newSize[0]);
                    if ($oldSize[0] >= $oldSize[1]) {
                        $this->assertEquals($newSize[0], min(1920, $oldSize[0]));
                    } else {
                        $this->assertEquals($newSize[1], min(1920, $oldSize[1]));
                    }
                } else {
                    $this->assertEquals(filesize($realFilePath), filesize($file['tmp_name']));
                }
            }
        }
        foreach ($files as $file) {
            $filename = $file['name'];
            $realFilePath = $realPath . '/' . $filename;
            @unlink($realFilePath);
            @unlink(str_replace('.jpeg', '.jpg', $realFilePath));
        }
    }


    /**
     * Тест метода process()
     * @param string $expectedMethod Ожидаемый метод
     * @param array $args Аргументы метода
     * @param string $url URL параметров запроса
     * @param array $post Массив $_POST
     * @param array $files Массив $_FILES
     * @param int $expectedExceptionCode Ожидаемый код исключения (0 для нормального варианта)
     */
    #[TestWith([
        'makeDir',
        ['image/design', 'testdir'],
        'action=mkdir&path=image/design',
        ['name' => 'testdir'],
    ])]
    #[TestWith([
        'delete',
        ['image/design'],
        'action=delete&path=image/design',
        ['@dummy' => ''],
    ])]
    #[TestWith([
        'rename',
        ['image/design', 'design2'],
        'action=rename&path=image/design',
        ['name' => 'design2'],
    ])]
    #[TestWith([
        'move',
        ['image/design/nophoto.jpg', 'image'],
        'action=move&path=image/design/nophoto.jpg',
        ['to' => 'image'],
    ])]
    #[TestWith([
        'upload',
        [
            'image/design',
            [
                ['name' => 'aaa.jpg', 'tmp_name' => '//aaa.jpg'],
                ['name' => 'bbb.jpg', 'tmp_name' => '//bbb.jpg'],
            ],
        ],
        'action=upload&path=image/design',
        ['@dummy' => ''],
        ['files' => ['name' => ['aaa.jpg', 'bbb.jpg'], 'tmp_name' => ['//aaa.jpg', '//bbb.jpg']]],
    ])]
    #[TestWith([
        'pathInfo',
        ['image/design'],
        'path=image/design',
    ])]
    #[TestWith([
        '',
        [],
        'action=mkdir&path=image/design',
        [],
        [],
        405,
    ])]
    public function testProcess(
        ?string $expectedMethod = null,
        array $args = [],
        string $url = '',
        array $post = [],
        array $files = [],
        int $expectedExceptionCode = 0,
        string $expectedExceptionText = ''
    ) {
        parse_str($url, $_GET);
        $_POST = $post;
        $_FILES = $files;
        if ($args[0] ?? null) {
            $args[0] = realpath(Application::i()->baseDir . '/files/cms/common/' . $args[0]);
        }
        if ($expectedMethod == 'move' && ($args[1] ?? null)) {
            $args[1] = realpath(Application::i()->baseDir . '/files/cms/common/' . $args[1]);
        }
        if ($post) {
            $_SERVER['REQUEST_METHOD'] = 'POST';
        }

        if ($expectedMethod) {
            $filemanager = $this->getMockBuilder(FileManager::class)->onlyMethods([$expectedMethod])->getMock();
            $filemanager->expects($this->once())->method($expectedMethod)->with(...$args);
        } else {
            $filemanager = new FileManager();
        }
        $filemanager->debug = true;
        $result = $filemanager->process();
        // var_dump($expectedMethod, $result);
        if ($expectedExceptionCode) {
            $this->assertEquals($expectedExceptionCode, $result['error']['code']);
        } else {
            $this->assertTrue(isset($result['result']));
        }
    }
}
