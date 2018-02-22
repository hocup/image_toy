# image_toy

This is a very simple attempt at a genetic algorithm to generate a set of triangles that approximate an input image.
There is a [demo](https://gmalyshev.net/image_toy/)

## Building

To get this running, you will need to get the npm modules required by the server:
```
npm install
```

If you don't already have typescript installed, you will need to install that as well:
```
npm install -g typescript
```

After that, it is a matter of compiling the scripts from the `public` folder and starting up the server:
```
cd public
tsc
tsc -p workers/
cd ..
node .
```
The server will start on port 3030, and you should be able to launch the app by pointing your browser to [http://localhost:3030](http://localhost:3030)

## Running as a service
Make a copy of `image_toy.service.template` to `image_toy.service` with appropriate changes
Copy `image_toy.service` into `/etc/systemd/system`
Make systemd aware of new service:
```
 systemctl daemon-reload
```
Start the service:
```
 systemctl start image_toy
```
Read logs:
```
 journalctl --follow -u image_toy
```