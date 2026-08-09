type Resource = "songs" | "artists";
type Endpoint = `/api/${Resource}`;

function endpoint(resource: Resource): Endpoint {
  return `/api/${resource}`;
}

type Unwrap<T> = T extends Promise<infer U> ? U : T;

async function loadPlayCount(): Promise<number> {
  return 41;
}

const cached: Unwrap<ReturnType<typeof loadPlayCount>> = 41;
const plain: Unwrap<string> = "already plain";

console.log(endpoint("songs"));
console.log(endpoint("artists"));
console.log(cached + 1);
console.log(plain);
