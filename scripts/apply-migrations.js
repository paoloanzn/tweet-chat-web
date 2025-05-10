import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyMigrations() {
  const placeholder = '{{BACKEND_ROLE_PASSWORD}}';
  const migrationDir = path.join(__dirname, '../supabase/migrations');
  let generatedPassword = '';
  let migrationPath = '';

  try {
    // Step 1: Generate a random password
    generatedPassword = randomBytes(16).toString('hex'); // 32-character random string
    console.log('Generated backend role password:', generatedPassword);

    // Step 2: Replace placeholder in migration file (if exists)
    const migrationFiles = await fs.readdir(migrationDir);
    const migrationFile = migrationFiles.find(file => file.endsWith('create_backend_role.sql'));
    
    if (migrationFile) {
      migrationPath = path.join(migrationDir, migrationFile);
      let migrationContent = await fs.readFile(migrationPath, 'utf8');
      if (!migrationContent.includes(placeholder)) {
        console.warn(`Warning: Placeholder ${placeholder} not found in ${migrationPath}`);
      }
      migrationContent = migrationContent.replace(placeholder, generatedPassword);
      await fs.writeFile(migrationPath, migrationContent);
      console.log(`Updated ${migrationPath} with generated password`);
    } else {
      console.log('No create_backend_role.sql migration file found; skipping migration file update');
    }

    // Step 3: Run Supabase commands
    console.log('Starting Supabase and applying migrations...');
    execSync('npx supabase start && npx supabase db reset', { stdio: 'inherit' });
    console.log('Migrations applied successfully');

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    // Always restore the placeholder in the migration file
    if (migrationPath && generatedPassword) {
      try {
        let migrationContent = await fs.readFile(migrationPath, 'utf8');
        migrationContent = migrationContent.replace(generatedPassword, placeholder);
        await fs.writeFile(migrationPath, migrationContent);
        console.log(`Restored placeholder in ${migrationPath}`);
      } catch (revertError) {
        console.error(`Error restoring placeholder in ${migrationPath}:`, revertError.message);
      }
    }

    // Log the generated password for reference
    if (generatedPassword) {
      console.log('Generated backend role password (save this securely):', generatedPassword);
      console.log(`Connection string: postgresql://backend:${generatedPassword}@127.0.0.1:54322/postgres`);
    }
  }
}

applyMigrations();