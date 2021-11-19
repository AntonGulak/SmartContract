import { migrate, MigrateDBConfig } from 'postgres-migrations';
import { db } from '../config/db';
import { Migration } from 'postgres-migrations/dist/types';

const migrationFolder = 'migrations';
const onSuccess = (value: Migration[]) => {
    if (!value.length) {
        console.log('No new migrations found.');
        return;
    }

    console.log('Applying migrations:');
    value.map((v: Migration) => console.log(v.fileName));
}

migrate(<MigrateDBConfig>db, migrationFolder)
    .then(onSuccess)
    .catch(e => console.error(e));
