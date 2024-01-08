# Filesystem Based Route API

## Specs

- [x] - Under the API folder the directory structure is used to define the route.
- [x] - Only the route.js|ts are recognized as route files.
- [x] - Functions exported by these files need to have the name of a supported HTTP method (this is to define the HTTP method of the route)
- [x] - A route file can export more than one method function at a time
- [x] - Exported functions need to have access to the Request and Response objects
