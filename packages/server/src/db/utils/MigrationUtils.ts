export abstract class MigrationUtils {
    /**
     *
     * @param files
     * @throws Error if the migration files are not named correctly
     * Migration files must be named in the format: number_name.sql
     */
    public static validateFilesOrThrow(files: string[]) {
        const invalidFiles: string[] = []
        const validFileNames = files.every((migrationFile) => {
            if (migrationFile.split('_')[0] === undefined) {
                invalidFiles.push(migrationFile)
                return false
            }
            return true
        })

        if (!validFileNames) {
            throw new Error(
                'Invalid migration file names: ' + invalidFiles.join(' ')
            )
        }
    }
    public static sortFiles(files: string[]) {
        return files.sort((a, b) => {
            const aNum = parseInt(a.split('_')[0])
            const bNum = parseInt(b.split('_')[0])
            return aNum - bNum
        })
    }
}
