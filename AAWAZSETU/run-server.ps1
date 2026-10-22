$code = @"
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class AsyncTcpServer
{
    private TcpListener listener;
    private string rootDir;

    public AsyncTcpServer(int port, string root)
    {
        rootDir = root;
        listener = new TcpListener(IPAddress.Any, port);
    }

    public void Start()
    {
        listener.Start();
        Console.WriteLine("Server started on port 8080");
        while (true)
        {
            try
            {
                var client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(new WaitCallback(HandleClient), client);
            }
            catch { }
        }
    }

    private void HandleClient(object clientObj)
    {
        var client = (TcpClient)clientObj;
        using (client)
        using (var stream = client.GetStream())
        {
            try
            {
                var reader = new StreamReader(stream, Encoding.UTF8);
                string firstLine = reader.ReadLine();
                if (string.IsNullOrWhiteSpace(firstLine)) return;

                string[] parts = firstLine.Split(' ');
                if (parts.Length < 2) return;

                string rawUrl = parts[1].Split('?')[0];
                if (rawUrl == "/" || string.IsNullOrWhiteSpace(rawUrl)) rawUrl = "/index.html";

                string relPath = rawUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                string fullPath = Path.Combine(rootDir, relPath);

                if (File.Exists(fullPath))
                {
                    string ext = Path.GetExtension(fullPath).ToLower();
                    string mime = "text/plain; charset=utf-8";
                    if (ext == ".html") mime = "text/html; charset=utf-8";
                    else if (ext == ".css") mime = "text/css; charset=utf-8";
                    else if (ext == ".js") mime = "application/javascript; charset=utf-8";
                    else if (ext == ".json") mime = "application/json; charset=utf-8";
                    else if (ext == ".svg") mime = "image/svg+xml";
                    else if (ext == ".png") mime = "image/png";
                    else if (ext == ".jpg") mime = "image/jpeg";

                    byte[] data = File.ReadAllBytes(fullPath);
                    string header = "HTTP/1.1 200 OK\r\nContent-Type: " + mime + "\r\nContent-Length: " + data.Length + "\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
                    byte[] headerBytes = Encoding.UTF8.GetBytes(header);
                    stream.Write(headerBytes, 0, headerBytes.Length);
                    stream.Write(data, 0, data.Length);
                }
                else
                {
                    byte[] notFound = Encoding.UTF8.GetBytes("404 Not Found");
                    string header = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: " + notFound.Length + "\r\nConnection: close\r\n\r\n";
                    byte[] headerBytes = Encoding.UTF8.GetBytes(header);
                    stream.Write(headerBytes, 0, headerBytes.Length);
                    stream.Write(notFound, 0, notFound.Length);
                }
            }
            catch { }
        }
    }
}
"@

Add-Type -TypeDefinition $code -Language CSharp
$server = New-Object AsyncTcpServer(8080, "d:\AAWAZSETU")
$server.Start()
