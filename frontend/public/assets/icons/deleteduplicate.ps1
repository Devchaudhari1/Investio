#automatically ignores duplicate name result
$path = Get-Location
$dup ="pngkey.com-"
$extension=".png"
Write-Output "Path : $path"
Get-ChildItem -Path $path -Filter "*.png" | ForEach-Object {
    $name = $($_.BaseName)
    $ext= $_.extension
    # Write-Output "Full Name :$name  $ext"
    $newbasename= $name -replace '\d+$' , ''
    if($name[-1] -eq ')')
    {
        Remove-Item $_.Name
        Write-Output "Item to be removed $name" 
    }
    else
    {
    if($newbasename.Length -ge 7 )
    {
        if($ext -eq $extension)
        {
        $first = $newbasename.Substring(0,$dup.Length)
        }
        else 
        {
            continue
        }
    }
    else
    {
        continue
    }
        # Write-Host "$first"
    if($first -eq "pngkey.com-")
    {
        $newname = $newbasename.Substring($dup.length) -replace '-png-$',''
        $newname=$newname+$ext
        Rename-Item $_.FullName $newname

    }
    }
}