# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# We're sending a plain text fragment
Content-Type: wrong/type


# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 415
HTTP/1.1 415
