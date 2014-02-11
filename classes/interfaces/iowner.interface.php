<?php
/**
 * ���� ���������� ��������� ���� �������
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * ��������� ��������� ���� RAAS
 * 
 * ��������� ���� ������������ �������������� � ��������
 * @package RAAS
 */       
interface IOwner
{
    /**
     * �������� ������� �������
     * @param \RAAS\IRightsContext $Context �������� �������
     * @return \RAAS\Access ������� �������          
     */         
    function access(IRightsContext $Context);
}