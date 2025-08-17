# PromoBarX Assignment Schema Migration

This document describes the database migration that updates the `wp_promo_bars` table to use a new assignment schema.

## Changes Made

### 1. Database Schema Changes

The `wp_promo_bars` table has been updated with the following changes:

**New Columns Added:**
- `assignment_type` - enum('global', 'page', 'post_type', 'category', 'tag', 'custom') DEFAULT 'global'
- `target_id` - bigint(20) DEFAULT 0
- `target_value` - varchar(255) DEFAULT ''
- `priority` - int(11) DEFAULT 0

**Column Removed:**
- `assignments` - JSON column (old assignment data)

### 2. Code Changes

#### Database Class (`includes/class-topbar-database.php`)
- Added `migrate_assignment_schema()` method to handle the migration
- Updated `create_tables()` method to use the new schema
- Updated `insert_default_promo_bar()` method to use new columns
- Updated `save_promo_bar()` method to handle new schema
- Added `update_promo_bar()` method for updating assignment data

#### Manager Class (`includes/class-topbar-manager.php`)
- Updated `calculate_page_match_score()` method to use assignment data directly from promo bar object
- Updated `ajax_get_assignments()` method to return assignment data from promo bar
- Updated `ajax_save_assignments()` method to update promo bar directly

### 3. Migration Process

The migration process:
1. Checks if migration is needed by examining current table structure
2. Adds new columns if they don't exist
3. Migrates data from old `assignments` JSON column to new columns
4. Removes the old `assignments` column
5. Uses database transactions to ensure data integrity

## Files Created

### Migration Scripts
- `migrate-assignments.php` - Main migration script
- `test-migration.php` - Test script to verify migration

## How to Run the Migration

### Option 1: Automatic Migration
The migration runs automatically when the plugin is loaded, as it's called in the database class constructor.

### Option 2: Manual Migration
1. Place `migrate-assignments.php` in the plugin root directory
2. Access it via browser: `https://yoursite.com/wp-content/plugins/promo-bar-x/migrate-assignments.php`
3. The script will show the migration progress and results

### Option 3: Test Migration
1. Place `test-migration.php` in the plugin root directory
2. Access it via browser: `https://yoursite.com/wp-content/plugins/promo-bar-x/test-migration.php`
3. The script will test the migration and show detailed results

## Data Migration

The migration preserves existing assignment data by:
1. Reading the JSON data from the old `assignments` column
2. Using the first assignment as the primary assignment
3. Storing the assignment data in the new columns:
   - `assignment_type` from the assignment type
   - `target_id` from the target ID
   - `target_value` from the target value
   - `priority` from the priority

## Backward Compatibility

The migration maintains backward compatibility by:
- Preserving all existing promo bar data
- Migrating assignment data to the new schema
- Updating all code to work with the new structure

## Verification

After migration, verify that:
1. All new columns exist in the `wp_promo_bars` table
2. The old `assignments` column has been removed
3. Assignment data has been migrated correctly
4. The plugin functionality works as expected

## Rollback

If you need to rollback the changes:
1. Restore the database from a backup taken before migration
2. Remove the migration code from the database class
3. Restore the old schema in the `create_tables()` method

## Notes

- The migration uses database transactions for safety
- All changes are logged for debugging purposes
- The migration is idempotent - it can be run multiple times safely
- Existing assignment data is preserved during migration

## Support

If you encounter any issues during migration:
1. Check the WordPress error logs for detailed error messages
2. Verify database permissions
3. Ensure you have a recent backup before running migration
4. Test the migration on a staging site first
