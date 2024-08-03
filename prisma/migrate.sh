#!/bin/bash

if [ -z "$1" ]; then
  echo "You need to provide your migration a name."
  exit 1
fi

migrationName=$1

prismaFolder=$(dirname $(realpath "$0"))

schemaFile="${prismaFolder}/schema.prisma"
migrationsFolder="${prismaFolder}/migrations"

echo "Generating migration \`${migrationName}\`..."

echo -e "\nTrying to generate the down migration file..."

downMigration=$(bunx prisma migrate diff --from-schema-datamodel "${schemaFile}" --to-schema-datasource "${schemaFile}" --script --exit-code)
exitCode=$?

if [ $exitCode -eq 0 ]; then
  echo "No difference detected."
  exit 0
elif [ $exitCode -eq 1 ]; then
  echo "Something went wrong, aborting."
  exit 1
elif [ $exitCode -eq 2 ]; then
  echo "Down migration generated!"
fi

echo -e "\nTrying to generate the up migration file..."

upOutput=$(bunx prisma migrate dev --name "${migrationName}")
exitCode=$?

if [[ $exitCode -eq 0 ]] && [[ $upOutput =~ ([0-9]{14}_"${migrationName}") ]]; then
  newMigrationFolder="${migrationsFolder}/${BASH_REMATCH[1]}"
  echo "Up migration generated!"
else
  echo "Something went wrong, aborting."
  exit 1
fi

echo -e "BEGIN;\n\n${downMigration}\n\nCOMMIT;" > "${newMigrationFolder}/down.sql"

{
  echo -e "BEGIN;\n\n"
  cat "${newMigrationFolder}/migration.sql"
  echo -e "\n\nCOMMIT;"
} > tmp_up_migration && mv tmp_up_migration "${newMigrationFolder}/migration.sql"

echo -e "\nMigration \`${migrationName}\` generated and applied, you're good to go!"