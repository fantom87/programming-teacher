#!/usr/bin/env bash
# Verifies the app inside a codespace the way a reviewer's browser reaches it:
# every request carries the GitHub proxy hostname, not localhost.
set -u
cd /workspaces/programming-teacher

# The codespace env vars are exported to the VS Code session but not to a bare
# ssh shell, so allow the name to be passed in: verify-codespace.sh <name>
CS_NAME="${1:-${CODESPACE_NAME:-}}"
if [ -z "$CS_NAME" ]; then
  echo "usage: verify-codespace.sh <codespace-name>   (or run inside the VS Code terminal)" >&2
  exit 2
fi
HOST_HDR="${CS_NAME}-5173.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
echo "proxy host header: $HOST_HDR"

echo "--- app page ---"
curl -s -o /dev/null -w 'status=%{http_code} type=%{content_type}\n' -H "Host: $HOST_HDR" http://localhost:5173/

echo "--- api health (through vite proxy) ---"
curl -s -H "Host: $HOST_HDR" http://localhost:5173/api/health | head -c 260
echo

echo "--- curriculum track count ---"
curl -s -H "Host: $HOST_HDR" http://localhost:5173/api/curriculum \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log('tracks:',j.tracks.length,'lessons:',j.tracks.reduce((n,t)=>n+t.units.reduce((m,u)=>m+u.lessons.length,0),0),'errors:',j.errors.length)})"

echo "--- run a python lesson (browser-runner lesson, checked server-side) ---"
curl -s -H "Host: $HOST_HDR" -H 'Content-Type: application/json' \
  -d '{"lessonId":"python/01-first-steps/01-hello-world","files":{"main.py":"print(\"Hello, world!\")\n"}}' \
  http://localhost:5173/api/check \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log('completed:',j.completed,'checks:',JSON.stringify(j.checks.map(c=>({id:c.checkId,passed:c.passed}))))})"

echo "--- run a C# lesson (real dotnet on linux) ---"
curl -s -H "Host: $HOST_HDR" -H 'Content-Type: application/json' \
  -d '{"lessonId":"csharp/01-csharp-fast-foundations/01-hello-dotnet","files":{"Program.cs":"Console.WriteLine(\"Hello, .NET!\");\n"}}' \
  http://localhost:5173/api/check \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log('completed:',j.completed,'checks:',JSON.stringify(j.checks.map(c=>({id:c.checkId,passed:c.passed,msg:c.message.slice(0,60)}))))})"
