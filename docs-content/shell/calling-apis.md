# Calling APIs

A web API is a URL that returns data instead of a web page. `Invoke-RestMethod` calls one and — because the response is almost always JSON — hands you ready-made objects. No parsing step; the pipeline starts immediately.

## Your first API call

```powershell
$post = Invoke-RestMethod "https://jsonplaceholder.typicode.com/posts/1"
$post.title       # the title field of the JSON response
$post.userId      # 1
```

That's the whole trick. GET is the default method; the JSON comes back as objects with dot-accessible properties.

## Drilling into responses

APIs return nested structures and arrays. Treat them like any other objects:

```powershell
$posts = Invoke-RestMethod "https://jsonplaceholder.typicode.com/posts"
$posts.Count                                    # 100
$posts | Where-Object { $_.userId -eq 3 } |
    Select-Object id, title -First 5
```

When you're unsure what came back, `$posts[0] | Get-Member` or `ConvertTo-Json -Depth 5` shows the shape.

## Query strings and headers

Parameters ride in the URL after `?`, joined by `&`:

```powershell
$url = "https://api.example.com/search?q=powershell&limit=10"
$results = Invoke-RestMethod $url
```

Many APIs need headers — often an API key:

```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod "https://api.example.com/me" -Headers $headers
```

Sending data uses `-Method Post` with a JSON `-Body`:

```powershell
$body = @{ title = "Hello"; body = "First post" } | ConvertTo-Json
Invoke-RestMethod $url -Method Post -Body $body -ContentType "application/json"
```

## Paging

APIs rarely return everything at once. The usual pattern: loop over pages until one comes back empty.

```powershell
$all = @()
$page = 1
do {
    $batch = Invoke-RestMethod "$url?page=$page&per_page=100"
    $all += $batch
    $page++
} while ($batch.Count -gt 0)
```

## Invoke-WebRequest: the lower-level sibling

`Invoke-RestMethod` returns parsed *data*. `Invoke-WebRequest` returns the whole *response* — status code, headers, raw content. Use it when you need those details, or to download files:

```powershell
Invoke-WebRequest "https://example.com/data.zip" -OutFile data.zip
```

A failed call (404, 500, no network) throws an error — wrap calls in `try/catch` so your script reports the problem instead of dying mid-loop. The error-handling page covers exactly how.
