const port = parseInt(Deno.env.get("PORT") ?? "8000");
async function index(_req: Request): Promise<Response> {
    const url = new URL(_req.url);
    const path = url.pathname;

    switch (path) {
        case "/hdiuhmalkmc9d0ck7UCFVGBJHN":
            const proxyURL = url.searchParams.get('destination');
            if (proxyURL) {
                const proxyReq = await fetch(decodeURIComponent(proxyURL), {
                    headers: _req.headers,
                    method: _req.method,
                    body: _req.body
                });
                return new Response(proxyReq.body, {
                    headers: proxyReq.headers,
                    status: proxyReq.status
                });
            } else {
                return new Response("Missing destination URL parameter", { status: 400 });
            }
        default:
            return new Response("Working");
    }
}
Deno.serve({port: port}, index);
