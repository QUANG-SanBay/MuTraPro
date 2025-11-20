#!/usr/bin/env bash
# Simple migration runner for local/dev. Customize for CI/CD if needed.

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-1433}"
DB_NAME="${DB_NAME:-mutrapro}"
DB_USER="${DB_USER:-sa}"
DB_PASS="${DB_PASS:-YourStrong!Passw0rd}"

echo "Running migrations on $DB_HOST:$DB_PORT ($DB_NAME)"

# Requires sqlcmd in PATH (use container: mcr.microsoft.com/mssql-tools)
sqlcmd -S "$DB_HOST,$DB_PORT" -U "$DB_USER" -P "$DB_PASS" -d master -b -Q "SELECT 1" >/dev/null

# apply init scripts if you want to re-run locally
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INIT_DIR="$BASE_DIR/infrastructure/sqlserver/init"

for f in "$INIT_DIR"/*.sql; do
  echo "Applying: $f"
  sqlcmd -S "$DB_HOST,$DB_PORT" -U "$DB_USER" -P "$DB_PASS" -d master -b -i "$f"
done

echo "Done."
