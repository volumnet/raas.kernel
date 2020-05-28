<?php
/**
 * Файл класса команды проверки отправки почты
 */
namespace RAAS;

/**
 * Команда проверки отправки почты
 */
class MailTestCommand extends Command
{
    /**
     * Отправляет тестовое письмо
     * @param string $email Адрес, на который отправляем
     * @param string $fromEmail Обратный адрес
     */
    public function process($email = null, $fromEmail = null)
    {
        $subject = 'Test';
        $message = '<p>This is a test message. Please do not reply.</p>';
        Application::i()->sendmail(
            [$email],
            $subject,
            $message,
            $fromEmail,
            $fromEmail,
            true
        );
    }
}
