define({
  "title": "Caport2020User API",
  "url": "https://cp2020.crs4.it/v1",
  "header": {
    "title": "API Overview",
    "content": "<p>For more info about the project, please visit the <a href=\"http://http://cp2020.crs4.it\">CagliariPortt2020 official website</a></p>\n<h2 id=\"security-authentication\">Security &amp; Authentication</h2>\n<p>All API endpoints use <strong>HTTPS</strong> protocol.</p>\n<p>All API endpoints <strong>MUST require authentication</strong>.</p>\n<p>Thus, you MUST obtain an API token and use it in HTTP header, as in:</p>\n<pre><code>Authentication: Bearer &lt;API_TOKEN&gt;\n</code></pre><p>or appending a URL parameter as in:</p>\n<pre><code>/authapp?access_token=&lt;API_TOKEN&gt;\n</code></pre><hr>\n<h2 id=\"pagination\">Pagination</h2>\n<p>All endpoints providing a listing functionality, like <code>/authuser</code>, returns paginated responses.\nPagination information is always provided using the following format:</p>\n<pre><code>...\n&quot;_metadata&quot;:{\n                &quot;skip&quot;:10,\n                &quot;limit&quot;:50,\n                &quot;totalCount&quot;:1500\n            }\n</code></pre>"
  },
  "footer": {
    "title": "Maintained by CRS4",
    "content": "<p>Codebase maintained by CRS4</p>\n"
  },
  "name": "Caport2020UserAPI",
  "version": "1.0.0",
  "description": "",
  "sampleUrl": false,
  "apidoc": "0.2.0",
  "generator": {
    "name": "apidoc",
    "time": "2016-06-22T14:43:29.241Z",
    "url": "http://apidocjs.com",
    "version": "0.12.3"
  }
});