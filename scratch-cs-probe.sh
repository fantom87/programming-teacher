#!/usr/bin/env bash
set -u
H="${1}-5173.app.github.dev"
curl -s -H "Host: $H" -H 'Content-Type: application/json' \
  -d '{"lessonId":"csharp/01-csharp-fast-foundations/01-hello-dotnet","files":{"Program.cs":"Console.WriteLine(\"Hello, .NET!\");\n"}}' \
  http://localhost:5173/api/run \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log('exit:',j.exitCode,'timedOut:',j.timedOut);console.log('stdout:',JSON.stringify(j.stdout));console.log('stderr:',JSON.stringify(j.stderr.slice(0,400)))})"
