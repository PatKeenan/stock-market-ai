import fs from 'fs'
import { db } from '../utils/db-client'
import { MigrationUtils } from './utils/MigrationUtils'

// Get all the files in the migrations directory which is up one level from this file
const migrations = fs.readdirSync(__dirname + '/migrations')

MigrationUtils.validateFilesOrThrow(migrations)

const sortedMigrations = MigrationUtils.sortFiles(migrations)

let startTime = Date.now()

Promise.all(
    sortedMigrations.map(async (migrationFile) => {
        let migrationContent
        try {
            migrationContent = fs.readFileSync(
                __dirname + '/migrations/' + migrationFile,
                'utf8'
            )
        } catch (error) {
            console.error(
                `Error reading migration file: ${migrationFile}: `,
                error
            )
        }
        if (!migrationContent) return

        const migrate = migrationContent.toString()
        try {
            await db.query(`${migrate}`)
            console.log(`Successfully migrated ${migrationFile}\n`)
        } catch (error) {
            console.error(`Error applying migration ${migrationFile}: `, error)
        }
        return
    })
)
    .catch((error) => {
        console.error('Error applying migrations: ', error)
    })
    .finally(() => {
        console.log(
            `Finished applying migrations in ${Date.now() - startTime}ms`
        )
        db.end()
    })
