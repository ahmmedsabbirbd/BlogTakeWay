<?php
/**
 * Direct fix script for missing templates table
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Fix Missing Templates Table - Direct Version</h1>";

// Database connection details (update these for your setup)
$host = 'localhost';
$dbname = 'promobarx'; // Update this to your database name
$username = 'root'; // Update this to your database username
$password = ''; // Update this to your database password
$table_prefix = 'wp_'; // Update this to your WordPress table prefix

try {
    // Connect to database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connection successful<br>";
    
    // Step 1: Check current tables
    echo "<h2>Step 1: Check Current Tables</h2>";
    
    $tables = [
        'promo_bars',
        'promo_bar_assignments', 
        'promo_bar_templates',
        'promo_bar_schedules',
        'promo_bar_analytics'
    ];
    
    foreach ($tables as $table) {
        $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
        $stmt->execute([$table_prefix . $table]);
        $exists = $stmt->fetch();
        
        if ($exists) {
            echo "✅ Table {$table} exists<br>";
        } else {
            echo "❌ Table {$table} is missing<br>";
        }
    }
    
    // Step 2: Create missing tables
    echo "<h2>Step 2: Create Missing Tables</h2>";
    
    // Templates table
    $sql_templates = "CREATE TABLE IF NOT EXISTS {$table_prefix}promo_bar_templates (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        description text,
        category varchar(100),
        preview_image varchar(500),
        config JSON,
        is_default tinyint(1) DEFAULT 0,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY category (category),
        KEY is_default (is_default)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql_templates);
    echo "✅ Templates table created successfully<br>";
    
    // Schedules table
    $sql_schedules = "CREATE TABLE IF NOT EXISTS {$table_prefix}promo_bar_schedules (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        promo_bar_id bigint(20) NOT NULL,
        start_date datetime,
        end_date datetime,
        days_of_week varchar(50),
        start_time time,
        end_time time,
        timezone varchar(50),
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY promo_bar_id (promo_bar_id),
        KEY start_date (start_date),
        KEY end_date (end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql_schedules);
    echo "✅ Schedules table created successfully<br>";
    
    // Analytics table
    $sql_analytics = "CREATE TABLE IF NOT EXISTS {$table_prefix}promo_bar_analytics (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        promo_bar_id bigint(20) NOT NULL,
        event_type enum('view', 'click', 'close', 'conversion') NOT NULL,
        page_url varchar(500),
        user_agent text,
        ip_address varchar(45),
        user_id bigint(20),
        session_id varchar(255),
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY promo_bar_id (promo_bar_id),
        KEY event_type (event_type),
        KEY created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql_analytics);
    echo "✅ Analytics table created successfully<br>";
    
    // Step 3: Insert default templates
    echo "<h2>Step 3: Insert Default Templates</h2>";
    
    $default_templates = [
        [
            'name' => 'Minimal Modern',
            'description' => 'Clean and modern design with subtle styling',
            'category' => 'minimal',
            'config' => json_encode([
                'background' => '#ffffff',
                'text_color' => '#333333',
                'accent_color' => '#4F46E5',
                'font_family' => 'Inter, sans-serif',
                'padding' => '12px 20px',
                'border_bottom' => '1px solid #e5e7eb'
            ])
        ],
        [
            'name' => 'Bold Attention',
            'description' => 'High-contrast design to grab attention',
            'category' => 'bold',
            'config' => json_encode([
                'background' => '#dc2626',
                'text_color' => '#ffffff',
                'accent_color' => '#fbbf24',
                'font_family' => 'Inter, sans-serif',
                'padding' => '16px 24px',
                'font_weight' => '600'
            ])
        ],
        [
            'name' => 'Sale Banner',
            'description' => 'Perfect for flash sales and promotions',
            'category' => 'ecommerce',
            'config' => json_encode([
                'background' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'text_color' => '#ffffff',
                'accent_color' => '#fbbf24',
                'font_family' => 'Inter, sans-serif',
                'padding' => '14px 20px',
                'animation' => 'pulse'
            ])
        ]
    ];
    
    foreach ($default_templates as $template) {
        // Check if template already exists
        $stmt = $pdo->prepare("SELECT id FROM {$table_prefix}promo_bar_templates WHERE name = ?");
        $stmt->execute([$template['name']]);
        $exists = $stmt->fetch();
        
        if (!$exists) {
            $stmt = $pdo->prepare("INSERT INTO {$table_prefix}promo_bar_templates (name, description, category, config) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $template['name'],
                $template['description'],
                $template['category'],
                $template['config']
            ]);
            echo "✅ Template '{$template['name']}' created successfully<br>";
        } else {
            echo "ℹ️ Template '{$template['name']}' already exists<br>";
        }
    }
    
    // Step 4: Verify templates
    echo "<h2>Step 4: Verify Templates</h2>";
    
    $stmt = $pdo->query("SELECT * FROM {$table_prefix}promo_bar_templates");
    $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($templates) {
        echo "✅ Found " . count($templates) . " templates:<br>";
        foreach ($templates as $template) {
            echo "- {$template['name']} ({$template['category']})<br>";
        }
    } else {
        echo "❌ No templates found<br>";
    }
    
    // Step 5: Test the specific query that was failing
    echo "<h2>Step 5: Test Template Query</h2>";
    
    $stmt = $pdo->prepare("SELECT id FROM {$table_prefix}promo_bar_templates WHERE name = ?");
    $stmt->execute(['Bold Attention']);
    $bold_template = $stmt->fetch();
    
    if ($bold_template) {
        echo "✅ 'Bold Attention' template found with ID: {$bold_template['id']}<br>";
    } else {
        echo "❌ 'Bold Attention' template not found<br>";
    }
    
    echo "<hr>";
    echo "<h2>Fix Summary</h2>";
    echo "<p>The missing templates table has been created and populated with default templates!</p>";
    echo "<p><strong>What was fixed:</strong></p>";
    echo "<ul>";
    echo "<li>Created missing promo_bar_templates table</li>";
    echo "<li>Created missing promo_bar_schedules table</li>";
    echo "<li>Created missing promo_bar_analytics table</li>";
    echo "<li>Inserted default templates (Minimal Modern, Bold Attention, Sale Banner)</li>";
    echo "<li>Verified template queries work correctly</li>";
    echo "</ul>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>Go to WordPress admin → Promo Bar X</li>";
    echo "<li>Create or edit a promo bar</li>";
    echo "<li>Select a template from the dropdown</li>";
    echo "<li>Verify templates are loading correctly</li>";
    echo "</ol>";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}
?>
