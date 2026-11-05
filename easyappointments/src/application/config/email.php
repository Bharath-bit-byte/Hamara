<?php defined('BASEPATH') or exit('No direct script access allowed');

// Add custom values by settings them to the $config array.
// Example: $config['smtp_host'] = 'smtp.resend.com';
// @link https://codeigniter.com/user_guide/libraries/email.html

$config['useragent'] = 'HamaraShops.ai - Easy!Appointments';
$config['protocol'] = getenv('MAIL_PROTOCOL') ?: 'mail'; // or 'smtp'
$config['mailtype'] = 'html'; // or 'text'
$config['smtp_auth'] = (bool) (getenv('MAIL_SMTP_AUTH') !== false ? getenv('MAIL_SMTP_AUTH') : true);
$config['smtp_host'] = getenv('MAIL_SMTP_HOST') ?: 'smtp.resend.com';
$config['smtp_user'] = getenv('MAIL_SMTP_USER') ?: 'resend';
$config['smtp_pass'] = getenv('MAIL_SMTP_PASS') ?: '';
$config['smtp_crypto'] = getenv('MAIL_SMTP_CRYPTO') ?: 'tls';
$config['smtp_port'] = (int) (getenv('MAIL_SMTP_PORT') ?: 587);
$config['from_name'] = getenv('MAIL_FROM_NAME') ?: 'HamaraShops.ai Business Consultations';
$config['from_address'] = getenv('MAIL_FROM_ADDRESS') ?: 'onboarding@resend.dev';
$config['reply_to'] = getenv('MAIL_REPLY_TO_ADDRESS') ?: 'info@hamarashops.ai';
$config['crlf'] = "\r\n";
$config['newline'] = "\r\n";
