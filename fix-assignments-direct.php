<?php
/**
 * Direct Fix script for PromoBarX Assignment Saving Issue
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>PromoBarX Assignment Fix - Direct Version</h1>";

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
    
    // Step 1: Drop assignments table if exists
    echo "<h2>Step 1: Dropping existing assignments table</h2>";
    $pdo->exec("DROP TABLE IF EXISTS {$table_prefix}promo_bar_assignments");
    echo "✅ Assignments table dropped<br>";
    
    // Step 2: Create new assignments table
    echo "<h2>Step 2: Creating new assignments table</h2>";
    $sql = "CREATE TABLE {$table_prefix}promo_bar_assignments (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        promo_bar_id bigint(20) NOT NULL,
        assignment_type enum('global', 'page', 'post_type', 'category', 'tag', 'custom') NOT NULL,
        target_id bigint(20) DEFAULT 0,
        target_value varchar(255) DEFAULT '',
        priority int(11) DEFAULT 0,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY promo_bar_id (promo_bar_id),
        KEY assignment_type (assignment_type),
        KEY target_id (target_id),
        KEY priority (priority)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql);
    echo "✅ Assignments table created successfully<br>";
    
    // Step 3: Test insertion
    echo "<h2>Step 3: Testing assignment insertion</h2>";
    
    // First, check if there are any promo bars
    $stmt = $pdo->query("SELECT id FROM {$table_prefix}promo_bars LIMIT 1");
    $promo_bar = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($promo_bar) {
        $promo_bar_id = $promo_bar['id'];
        echo "✅ Found existing promo bar with ID: {$promo_bar_id}<br>";
        
        // Test insertion
        $insert_sql = "INSERT INTO {$table_prefix}promo_bar_assignments 
                      (promo_bar_id, assignment_type, target_id, target_value, priority) 
                      VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($insert_sql);
        $result = $stmt->execute([
            $promo_bar_id,
            'global',
            0,
            'All Pages',
            1
        ]);
        
        if ($result) {
            echo "✅ Test assignment inserted successfully<br>";
            
            // Verify insertion
            $stmt = $pdo->prepare("SELECT * FROM {$table_prefix}promo_bar_assignments WHERE promo_bar_id = ?");
            $stmt->execute([$promo_bar_id]);
            $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($assignments) > 0) {
                echo "✅ Verified assignment was saved correctly<br>";
                foreach ($assignments as $assignment) {
                    echo "- Type: {$assignment['assignment_type']}, Target: {$assignment['target_value']}<br>";
                }
            } else {
                echo "❌ Assignment not found after insertion<br>";
            }
        } else {
            echo "❌ Failed to insert test assignment<br>";
        }
    } else {
        echo "⚠️ No promo bars found in database. Create a promo bar first.<br>";
    }
    
    echo "<hr>";
    echo "<h2>Fix Complete</h2>";
    echo "<p>The assignments table has been recreated successfully.</p>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>Go to WordPress admin → Promo Bar X</li>";
    echo "<li>Create or edit a promo bar</li>";
    echo "<li>Click 'Page Assignment'</li>";
    echo "<li>Add assignments and save</li>";
    echo "<li>Verify assignments are saved correctly</li>";
    echo "</ol>";
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "<br>";
    echo "<p><strong>Please update the database connection details at the top of this file:</strong></p>";
    echo "<ul>";
    echo "<li>Database name</li>";
    echo "<li>Username</li>";
    echo "<li>Password</li>";
    echo "<li>Table prefix</li>";
    echo "</ul>";
}
?>
