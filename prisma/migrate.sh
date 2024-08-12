#!/bin/bash

if [ -z "$1" ]; then
  echo -e "You need to provide your migration a name."
  exit 1
fi

migrationName=$1

prismaFolder=$(dirname $(realpath "$0"))

schemaFile="${prismaFolder}/schema.prisma"
migrationsFolder="${prismaFolder}/migrations"

echo -e "Generating migration \`${migrationName}\`..."

echo -e "\nTrying to generate the down migration file..."

downMigration=$(bunx prisma migrate diff --from-schema-datamodel "${schemaFile}" --to-schema-datasource "${schemaFile}" --script --exit-code)
exitCode=$?

if [ $exitCode -eq 0 ]; then
  echo -e "No difference detected."
  exit 0
elif [ $exitCode -eq 1 ]; then
  echo -e "Something went wrong, aborting."
  exit 1
elif [ $exitCode -eq 2 ]; then
  echo -e "Down migration generated!"
fi

echo -e "\nTrying to generate the up migration file..."

upMigration=$(bunx prisma migrate diff --from-schema-datasource "${schemaFile}" --to-schema-datamodel "${schemaFile}" --script --exit-code)
exitCode=$?

if [ $exitCode -eq 0 ]; then
  echo -e "No difference detected."
  exit 0
elif [ $exitCode -eq 1 ]; then
  echo -e "Something went wrong, aborting."
  exit 1
elif [ $exitCode -eq 2 ]; then
  echo -e "Down migration generated!"
fi

newMigrationFolder="${migrationsFolder}/$(date +"%Y%m%d%H%M%S")_${migrationName}"

mkdir -p "${newMigrationFolder}"

echo -e "BEGIN;\n\n${downMigration}\n\nCOMMIT;" > "${newMigrationFolder}/down.sql"
echo -e "BEGIN;\n\n${upMigration}\n\nCOMMIT;" > "${newMigrationFolder}/migration.sql"

echo -e ""

bunx prisma migrate deploy
exitCode=$?

if [ $exitCode -eq 0 ]; then
  echo -e "\nMigration \`${migrationName}\` generated and applied, you're good to go!"
  exit 0
else
  echo -e "\nMigration \`${migrationName}\` was generated but something went wrong when applying the migrations."
  exit $exitCode
fi
