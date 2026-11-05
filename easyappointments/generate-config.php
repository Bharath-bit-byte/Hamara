<?php
/**
 * HamaraShops.ai - Easy!Appointments Local Config Generator
 * 
 * Generates src/config.php from environment variables or sensible local defaults.
 * 
 * Usage:
 *   php generate-config.php
 */

$baseUrl = getenv('BASE_URL') ?: 'http://localhost:8085';
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('DB_NAME') ?: 'easyappointments';
$dbUser = getenv('DB_USERNAME') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';
$language = getenv('LANGUAGE') ?: 'english';
$debug = strtolower((string)(getenv('DEBUG_MODE') ?: 'true')) === 'false' ? 'false' : 'true';

$configContent = <<<PHP
<?php
/* ----------------------------------------------------------------------------
 * Easy!Appointments - Online Appointment Scheduler
 * Configured for HamaraShops.ai
 * Generated on: {date('Y-m-d H:i:s')}
 * ---------------------------------------------------------------------------- */

class Config
{
    // General Settings
    const BASE_URL = '{$baseUrl}';
    const LANGUAGE = '{$language}';
    const DEBUG_MODE = {$debug};

    // Database Settings
    const DB_HOST = '{$dbHost}';
    const DB_NAME = '{$dbName}';
    const DB_USERNAME = '{$dbUser}';
    const DB_PASSWORD = '{$dbPass}';
}
PHP;

$targetPath = __DIR__ . '/src/config.php';
file_put_contents($targetPath, $configContent);
echo "Easy!Appointments configuration generated successfully at: " . $targetPath . PHP_EOL;
echo "Base URL: " . $baseUrl . PHP_EOL;
echo "DB Host:  " . $dbHost . PHP_EOL;
echo "DB Name:  " . $dbName . PHP_EOL;
