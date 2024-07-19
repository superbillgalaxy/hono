const port = parseInt(Deno.env.get("PORT") ?? "8000");
async function index(_req: Request): Promise<Response> {
    const url = new URL(_req.url);
    const path = url.pathname;
    switch (path) {
        case "/dood":
            const doodURL = url.searchParams.get('url');
            if (doodURL) {
                try {
                    const doodReq = await fetch(`https://tempguy-scarletsole.web.val.run/dood/${encodeURIComponent(doodURL)}`, {
                        headers: _req.headers,
                        method: _req.method,
                        body: _req.body
                    });
                    const respText = await doodReq.text();
                    return new Response(respText, {
                        headers: doodReq.headers,
                        status: doodReq.status
                    });
                } catch (error) {
                    console.error("Error fetching /dood:", error);
                    return new Response("Error fetching /dood", { status: 500 });
                }
            } else {
                return new Response("Missing destination URL parameter", { status: 400 });
            }
        case "/hdiuhmalkmc9d0ck7UCFVGBJHN":
            const proxyURL = url.searchParams.get('destination');
            if (proxyURL) {
                try {
                    const proxyReq = await fetch(decodeURIComponent(proxyURL), {
                        headers: _req.headers,
                        method: _req.method,
                        body: _req.body
                    });
                    return new Response(proxyReq.body, {
                        headers: proxyReq.headers,
                        status: proxyReq.status
                    });
                } catch (error) {
                    console.error("Error fetching proxy URL:", error);
                    return new Response("Error fetching proxy URL", { status: 500 });
                }
            } else {
                return new Response("Missing destination URL parameter", { status: 400 });
            }
        default:
            return new Response("Working");
    }

}
Deno.serve({port: port}, index);
