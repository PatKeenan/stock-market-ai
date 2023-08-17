import { Pool, Client } from 'pg'

const shared = {
    port: 5438,
    password: 'postgres',
    user: 'postgres',
    database: 'main'
}

// Client is used for migrations only
export const client = new Client(shared)

// Db is used for queries
export const db = new Pool({
    ...shared,
    min: 2,
    max: 10
})
