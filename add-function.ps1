$filePath = "src\app\dashboard\page.tsx"
$content = Get-Content $filePath -Raw
$lines = $content -split "`r`n"

# Find line index for "  };" after compet

itor data mapping
$insertIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s+return \[\.\.\. brandData, \.\.\.competitorData\];' -and $lines[$i+1] -match '^\s+};') {
        $insertIndex = $i + 2
        break
    }
}

if ($insertIndex -gt 0) {
    $newFunction = @"

  // Generate dynamic platform data for bar chart
  const getPlatformChartData = () => {
    if (!selectedBrand?.platformDistribution) return platformData;
    return [
      { name: "Reddit", value: selectedBrand.platformDistribution.reddit, color: "#7DD3FC" },
      { name: "Google Search", value: selectedBrand.platformDistribution.googleSearch, color: "#93C5FD" },
      { name: "YouTube", value: selectedBrand.platformDistribution.youtube, color: "#60A5FA" }
    ];
  };
"@
    
    $newLines = @($lines[0..($insertIndex-1)]) + $newFunction + @($lines[$insertIndex..($lines.Count-1)])
    $newLines -join "`r`n" | Set-Content $filePath -NoNewline
    Write-Output "Function added at line $insertIndex"
} else {
    Write-Output "Could not find insertion point"
}
