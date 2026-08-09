// Types that compute: template literal types + conditional types.

// 1. type Resource = "songs" | "artists";
//    type Endpoint = ...a template literal type: `/api/` + each Resource.
//    function endpoint(resource: Resource): Endpoint — return the
//    interpolated path, then print endpoint("songs") and endpoint("artists").

// 2. type Unwrap<T> = ...conditional: if T extends Promise<infer U>,
//    produce U; otherwise produce T unchanged.

//    async function loadPlayCount(): Promise<number> { return 41; }

// 3. Prove the true branch — the annotation only compiles if Unwrap
//    computes number:
// const cached: Unwrap<ReturnType<typeof loadPlayCount>> = 41;
// console.log(cached + 1);

// 4. Prove the false branch:
// const plain: Unwrap<string> = "already plain";
// console.log(plain);
