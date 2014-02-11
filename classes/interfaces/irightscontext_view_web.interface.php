<?php
/**
 * ���� ���������� ���-������������� ��������� � ������������ ���������� ����
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * ��������� ���-������������� ��������� � ������������ ���������� ���� RAAS
 * 
 * �������� � ������������ ���������� ���� ������������ ����� ����� ����� ��� ������
 * @package RAAS
 * @property-read string $versionName ������������ ������ 
 */       
interface IRightsContext_View_Web extends IContext_View_Web
{
    /**
     * ������������� ��������� ������
     */         
    function header();
}