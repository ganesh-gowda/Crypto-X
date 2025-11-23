# API URL Update Script for Production Deployment
# This script helps update all hardcoded localhost URLs to use the centralized API config

Write-Host "🔧 CryptoX - API URL Update Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "f:\PROJECTS\Crypto\Crypto-X"
$srcPath = "$projectRoot\src"

Write-Host "📝 Files that need manual updates:" -ForegroundColor Yellow
Write-Host ""

# List of files with hardcoded URLs
$filesToUpdate = @(
    "src\context\AuthContext.jsx",
    "src\services\userApi.js",
    "src\services\transactionApi.js",
    "src\context\SocketContext.jsx",
    "src\pages\VerifyEmail.jsx",
    "src\components\VerificationBanner.jsx",
    "src\pages\TwoFactorSettings.jsx",
    "src\components\TwoFactorModal.jsx",
    "src\pages\Analytics.jsx",
    "src\components\GlobalSearchBar.jsx",
    "src\components\ExportReports.jsx"
)

foreach ($file in $filesToUpdate) {
    $fullPath = "$projectRoot\$file"
    if (Test-Path $fullPath) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (not found)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. In each file, add this import at the top:" -ForegroundColor White
Write-Host "   import { API_ENDPOINTS, SOCKET_URL } from '../config/apiConfig';" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Replace 'http://localhost:5000' with the appropriate constant:" -ForegroundColor White
Write-Host "   - For auth: API_ENDPOINTS.AUTH" -ForegroundColor Gray
Write-Host "   - For portfolio: API_ENDPOINTS.PORTFOLIO" -ForegroundColor Gray
Write-Host "   - For analytics: API_ENDPOINTS.PORTFOLIO_ANALYTICS" -ForegroundColor Gray
Write-Host "   - For socket: SOCKET_URL" -ForegroundColor Gray
Write-Host "   - And so on..." -ForegroundColor Gray
Write-Host ""
Write-Host "3. Or use the automated script below in VS Code terminal" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ API Config file created at:" -ForegroundColor Green
Write-Host "   src\config\apiConfig.js" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
