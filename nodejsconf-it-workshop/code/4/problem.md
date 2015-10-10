# Chat server with discovery.

Up until now, the client has had the server address hardcoded on the code, but what if we want to discover
the server without knowing it's IP? We can do that usining Multicast DNS. Build upon problem 3 to make the 
server discoverable through mdns and make the client connect to it like that.

## Tips

There is a module called [register-multicast-dns](https://github.com/mafintosh/register-multicast-dns)
which allows you to route a `.local` domain to your computer. Use this on the server to register
your server with a domain of your choice, and connect to said domain from your client.

## Testing

Pretty much the same as problem 3.
After you test it on your machine, try running the server and the client on different machines, and check
out how the client discovers the server.
