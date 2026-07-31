import http.server
import os
import re

class RangeHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None
        f = open(path, 'rb')
        fs = os.fstat(f.fileno())
        file_len = fs.st_size
        start, end = 0, file_len - 1
        range_header = self.headers.get('Range')
        if range_header:
            m = re.match(r'bytes=(\d*)-(\d*)', range_header)
            if m:
                if m.group(1):
                    start = int(m.group(1))
                if m.group(2):
                    end = int(m.group(2))
                else:
                    end = file_len - 1
        ctype = self.guess_type(path)
        self.send_response(206 if range_header else 200)
        self.send_header('Content-type', ctype)
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(end - start + 1))
        if range_header:
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        f.seek(start)
        self._range = (start, end)
        return f

    def copyfile(self, source, outputfile):
        if hasattr(self, '_range'):
            start, end = self._range
            remaining = end - start + 1
            bufsize = 64 * 1024
            while remaining > 0:
                chunk = source.read(min(bufsize, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        else:
            super().copyfile(source, outputfile)

if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8744
    http.server.test(HandlerClass=RangeHTTPHandler, port=port)
