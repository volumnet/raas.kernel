<?php
/**
 * ���� ���������� ���-������������� ���������
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * ��������� ���-������������� ��������� RAAS
 *
 * �������� ������������ ����� ���������� ����������, ����� ����� ��� ������
 * @package RAAS
 * @property-read string publicURL URL ����� � ���������
 * @property string $template �������� ������������� ������� � ���� "�����/������:������", "�����:������"
 *           ��� "������" = "�������_�����/�������_������:������"
 */
interface IContext_View_Web extends IAbstract_Context_View
{
     /**
     * ����� ������� � ������� �� �������� � ������
     * @param string $file ������������ �������
     * @return string ���� � ���������� ����� �������
     *                (���� ���� � ��������� ������, ������� ������,
     *                � ��������� ������ �� ����� ������ ��������, ���� ������
     *                �� ����� �����)
     */
    function tmp($file);
}
