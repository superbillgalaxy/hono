const port = parseInt(Deno.env.get("PORT") ?? "8000");
async function index(_req: Request): Promise<Response> {
    const url = new URL(_req.url);
    const path = url.pathname;

    switch (path) {
        case "/dood":
            const doodURL = url.searchParams.get('url');
            if (doodURL) {
                const doodReq = await fetch(`https://tempguy-scarletsole.web.val.run/dood/${encodeURIComponent(doodURL)}`, {
                    headers: _req.headers,
                    method: _req.method,
                    body: _req.body
                });
                return new Response(await doodReq.body, {
                    headers: doodReq.headers,
                    status: doodReq.status
                });
            } else {
                return new Response("Missing destination URL parameter", { status: 400 });
            }
            break;
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
