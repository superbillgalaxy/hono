const port = parseInt(Deno.env.get("PORT") ?? "8000");
import { doodstream, format, streamwish } from "https://esm.town/v/tempguy/redMonkey";
import { Hono } from "npm:hono";

const app = new Hono();

interface MetaData {
  Sites: {
    Gogoanime: Record<string, {
      identifier: string;
    }>;
  };
  title: string;
}

interface Source {
  quality: string;
  url: string;
}

interface BaseData {
  name: string;
  url: string;
}

app.get("/embed/:id/:ep/:dub", async (c) => {
  const id = c.req.param("id");
  const ep = Number(c.req.param("ep"));
  const dub = c.req.param("dub") === "dub";

  const results: any[] = [];
  const metaResponse = await fetch(
    `https://cool-proxy.koyeb.app/hdiuhmalkmc9d0ck7UCFVGBJHN?destination=https://api.malsync.moe/mal/anime/${id}`,
  );
  const metaData: MetaData = await metaResponse.json();
  const GOGO = metaData.Sites.Gogoanime;

  const watchID = Object.values(GOGO).flatMap((data) => {
    const isDub = data.identifier.includes("dub");
    console.log(data.identifier);
    if ((dub && isDub) || (!dub && !isDub)) {
      const episodeIdentifier = `${data.identifier}-episode-${ep}`;
      return [
        fetch(`https://animetize-api.vercel.app/servers/${episodeIdentifier}`),
        fetch(`https://animetize-api.vercel.app/watch/${episodeIdentifier}`),
      ];
    }
    return [];
  });

  const [baseResponse, mainResponse] = await Promise.all(watchID);
  const baseData: BaseData[] = await baseResponse.json();
  const mainData: { sources: Source[] } = await mainResponse.json();

  await Promise.all(
    mainData.sources.map(async (data) => {
      if (data.quality === "default" || data.quality === "backup") {
        results.push(await format(data.url));
      }
    }),
  );

  await Promise.all(
    baseData.map(async (data) => {
      const _ = data.url.split("/")[4];
      switch (data.name) {
        case "Streamwish":
          results.push(await streamwish({ url: "https://streamwish.to/" + _ }));
          break;
        case "Doodstream":
          results.push(await doodstream({ url: "https://d000d.com/e/" + _ }));
          break;
        case "Vidhide":
          // Uncomment if Vidhide logic is needed
          // results.push(await streamwish({ url: "https://vidhidepro.com/v/" + _ }));
          break;
      }
    }),
  );

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${metaData.title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;700&display=swap');
        html, body {
          font-family: 'Lexend';
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: sans-serif;
          background: #090909;
          color: #ddd;
          position: relative;
        }
        #server-select-server {
          position: absolute;
          top: 5px;
          left: 5px;
          padding: 5px;
        }
        select {
          background: #FFF;
          color: #000;
          border: 2px solid black;
          border-radius: 7px;
          z-index: 100;
        }
        #player {
          width: 100%;
          height: 100%;
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack/styles/defaults.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack/styles/community-skin/video.min.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/vidstack/dist/cdn/prod.min.js"></script>
    </head>
    <body onload="initPlayer()">
      <media-player autoplay id="player" muted title="Cool Embed" poster="https://raw.githubusercontent.com/cool-dev-guy/cool-embed/main/static/assets/embed.png" src="https://cdn.plyr.io/static/blank.mp4" aspect-ratio="16/9" crossorigin>
        <media-outlet>
          <media-poster alt="Cool Embed....."></media-poster>
        </media-outlet>
        <media-community-skin></media-community-skin>
        <div id="server-select">
          <select id="server-select-server" onchange="loadServer(this.value)"></select>
        </div>
      </media-player>
      <script>
        let streams = [];

        function initPlayer() {
          const video = document.querySelector("media-player");
          const serverContainer = document.querySelector("#server-select");
          const server = document.querySelector("#server-select-server");
          video.addEventListener('play', () => serverContainer.style.display = 'none');
          video.addEventListener('pause', () => serverContainer.style.display = 'block');
          const videoData = ${JSON.stringify(results)};
          videoData.forEach((_, i) => {
            const option = document.createElement('option');
            option.value = \`\${_.stream[0].qualities.unknown.url}\`;
            option.textContent = \`Server \${i + 1}\`;
            server.appendChild(option);
            streams.push(\`\${_.stream[0].qualities.unknown.url}\`);
          });
          loadServer(streams[0]);
        }

        function loadServer(val) {
          const player = document.querySelector("media-player");
          player.src = val;
          // player.startLoading();
          player.play();
        }
      </script>
    </body>
    </html>`);
});

app.get("/watch/:id/:ep/:dub", async (c) => {
  const id = c.req.param("id");
  const ep = Number(c.req.param("ep"));
  const dub = c.req.param("dub") === "dub";

  const results: any[] = [];
  const metaResponse = await fetch(
    `https://cool-proxy.koyeb.app/hdiuhmalkmc9d0ck7UCFVGBJHN?destination=https://api.malsync.moe/mal/anime/${id}`,
  );
  const metaData: MetaData = await metaResponse.json();
  const GOGO = metaData.Sites.Gogoanime;

  const watchID = Object.values(GOGO).flatMap((data) => {
    const isDub = data.identifier.includes("dub");
    if ((dub && isDub) || (!dub && !isDub)) {
      const episodeIdentifier = `${data.identifier}-episode-${ep}`;
      return [
        fetch(`https://animetize-api.vercel.app/servers/${episodeIdentifier}`),
        fetch(`https://animetize-api.vercel.app/watch/${episodeIdentifier}`),
      ];
    }
    return [];
  });

  const [baseResponse, mainResponse] = await Promise.all(watchID);
  const baseData: BaseData[] = await baseResponse.json();
  const mainData: { sources: Source[] } = await mainResponse.json();

  await Promise.all(
    mainData.sources.map(async (data) => {
      if (data.quality === "default" || data.quality === "backup") {
        results.push(await format(data.url));
      }
    }),
  );

  await Promise.all(
    baseData.map(async (data) => {
      const _ = data.url.split("/")[4];
      switch (data.name) {
        case "Streamwish":
          results.push(await streamwish({ url: "https://awish.pro/e/" + _ }));
          break;
        case "Doodstream":
          results.push(await doodstream({ url: "https://d000d.com/e/" + _ }));
          break;
        case "Vidhide":
          // Uncomment if Vidhide logic is needed
          // results.push(await streamwish({ url: "https://vidhidepro.com/v/" + _ }));
          break;
      }
    }),
  );

  let controls = results.map((_, index) => `<button onclick="loadVideo(${index})">Load Video ${index + 1}</button>`)
    .join("");

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${metaData.title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;700&display=swap');
        html, body {
          font-family: 'Lexend';
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: sans-serif;
          background: #090909;
          color: #ddd;
          position: relative;
        }
        #server-select-server {
          position: absolute;
          top: 5px;
          left: 5px;
          padding: 5px;
        }
        select {
          background: #FFF;
          color: #000;
          border: 2px solid black;
          border-radius: 7px;
          z-index: 100;
        }
        #player {
          width: 100%;
          height: 100%;
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack/styles/defaults.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack/styles/community-skin/video.min.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/vidstack/dist/cdn/prod.min.js"></script>
    </head>
    <body>
      <media-player autoplay id="player" muted title="Cool Embed" poster="https://raw.githubusercontent.com/cool-dev-guy/cool-embed/main/static/assets/embed.png" src="https://cdn.plyr.io/static/blank.mp4" aspect-ratio="16/9" crossorigin>
        <media-outlet>
          <media-poster alt="Cool Embed....."></media-poster>
        </media-outlet>
        <media-community-skin></media-community-skin>
      </media-player>
      ${controls}
      <script>
        const results = ${JSON.stringify(results)};

        function loadVideo(index) {
          const player = document.querySelector("media-player");
          player.src = results[index].stream[0].qualities.unknown.url;
          player.play();
        }
      </script>
    </body>
    </html>`);
});

Deno.serve({port: port}, app.fetch);
