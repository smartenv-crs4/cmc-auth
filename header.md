For more info about the project, please visit the [CagliariPortt2020 official website](http://cp2020.crs4.it)

Security & Authentication
-------------------------
All API endpoints use **HTTPS** protocol.

All API endpoints **MUST require authentication**.



Thus, you MUST obtain an API token and use it in HTTP header, as in:

    Authentication: Bearer <API_TOKEN>

or appending a URL parameter as in:

    /authapp?access_token=<API_TOKEN>

***

Pagination
-------------------------

All endpoints providing a listing functionality, like `/authuser`, returns paginated responses.
Pagination information is always provided using the following format:

    ...
    "_metadata":{
                    "skip":10,
                    "limit":50,
                    "totalCount":1500
                }



Access_Token to try API
-----------------------

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg .tg-baqh{text-align:center;vertical-align:top}
</style>
<table class="tg">
  <tr>
    <th class="tg-baqh">Token Type</th>
    <th class="tg-baqh">access_token</th>
  </tr>
  <tr>
    <td class="tg-baqh">User Token Type</td>
    <td class="tg-baqh">eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.<br>eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YmRhNWMxMzk1YTNkMjdhYmVjMzQ5YiIsImVtY<br>WlsIjoiYWRtaW5AYWRtaW4uY29tIiwidHlwZSI6ImFkbWluIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNDkwMDE3MDcyNDY4fQ.<br>NS0B-MnuMensDhLBe13I3dxzKWvqQeKQ5Z49cqmIeXs</td>
  </tr>
  <tr>
    <td class="tg-baqh">Application Token Type</td>
    <td class="tg-baqh">eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.<br>eyJtb2RlIjoiZGV2ZWxvcGVyIiwiaXNzIjoiNThjNmQyNGMxMWFmMTA4MWY2OTYwZTE3I<br>iwiZW1haWwiOiJwaXBwbzZAcGlwcG8uaXQiLCJ0eXBlIjoiYWRtaW5BcHAiLCJlbmFibGVkIjp0cnVlLCJleHAiOjE0OTAwMjk3NzMwNzh9.<br>jXivXxjnOlbFVBiLpdS1em2__EvS08Ms4pf5jtVz9Mo</td>
  </tr>
</table>


Username to login and get Token to try API
------------------------------------------------

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
.tg .tg-baqh{text-align:center;vertical-align:top}
</style>
<table class="tg">
  <tr>
    <th class="tg-baqh">Login Type</th>
    <th class="tg-baqh">Username</th>
    <th class="tg-baqh">password</th>
  </tr>
  <tr>
    <td class="tg-baqh">User Login</td>
    <td class="tg-baqh">admin@admin.com</td>
    <td class="tg-baqh">admin</td>
  </tr>
  <tr>
    <td class="tg-baqh">Application Login</td>
        <td class="tg-baqh">application@admin.com</td>
        <td class="tg-baqh">admin</td>
  </tr>
</table>