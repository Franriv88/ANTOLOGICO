# Carga datos de prueba en el emulador local de SQL Connect.
# Requiere que los emuladores estén corriendo: pnpm emulators
# Uso: .\scripts\seed-local.ps1

$env:FIREBASE_DATA_CONNECT_EMULATOR_HOST = "127.0.0.1:9399"
$file = "dataconnect/seed_data.gql"

$ops = @(
    "SeedRubroArte", "SeedRubroMusica", "SeedRubroCocina", "SeedRubroBienestar",
    "SeedRubroFotografia", "SeedRubroIdiomas", "SeedRubroTecnologia", "SeedRubroEducacion",
    "SeedPlanEsencial", "SeedPlanProfesional", "SeedPlanEstudio"
)

foreach ($op in $ops) {
    $out = firebase dataconnect:execute $file $op 2>&1 | Out-String
    if ($out -match '"errors":\s*\[\]') { Write-Host "✓  $op" }
    else { Write-Host "✗  $op`n$out" }
}

Write-Host "`nSeed completo."
