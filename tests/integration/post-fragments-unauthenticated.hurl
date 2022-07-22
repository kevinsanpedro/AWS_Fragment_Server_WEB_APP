# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Authorization: Basic wrongUser

# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8

# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 401
HTTP/1.1 401

# We have various assertions about the response that we want to check
[Asserts]
# The response should be error and Unauthorized
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Unauthorized"






