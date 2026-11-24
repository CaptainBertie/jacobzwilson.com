"""Local preview server: `python3 -m http.server`, plus a header making the browser check each saved file is current."""
import contextlib, functools, http.server, socket, sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # keep a copy, but ask the server before reusing it (unchanged files answer "304, use yours")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


class Server(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        # answer on both localhost addresses (127.0.0.1 and ::1)
        with contextlib.suppress(Exception):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    with Server(("::", port), functools.partial(Handler, directory="site")) as srv:
        srv.serve_forever()
