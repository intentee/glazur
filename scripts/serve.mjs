import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const REPOSITORY_ROOT = resolve(import.meta.dirname, "..");

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = createServer(function (request, response) {
  const requestUrl = new URL(request.url, "http://localhost");
  const requestPath = decodeURIComponent(requestUrl.pathname);
  const filePath = resolve(REPOSITORY_ROOT, `.${requestPath}`);

  if (
    filePath !== REPOSITORY_ROOT &&
    !filePath.startsWith(REPOSITORY_ROOT + sep)
  ) {
    response.writeHead(403);
    response.end("Forbidden");

    return;
  }

  const contentType =
    CONTENT_TYPES.get(extname(filePath)) ?? "application/octet-stream";
  const fileStream = createReadStream(filePath);

  fileStream.on("open", function () {
    response.writeHead(200, { "Content-Type": contentType });
  });

  fileStream.on("error", function () {
    response.writeHead(404);
    response.end("Not found");
  });

  fileStream.pipe(response);
});

server.listen(0, function () {
  const address = server.address();
  const port =
    typeof address === "object" && address !== null ? address.port : 0;

  process.stdout.write(
    `Glazur demo running at http://localhost:${port}/demo/index.html\n`,
  );
});
