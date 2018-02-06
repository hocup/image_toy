# image_toy

This is a very simple attempt at a genetic algorithm to generate a set of triangles that approximate an input image.

## Building

To get this running, you will need to get the npm modules required by the server:
```
npm install
```

If you don't already have typescript installed, you will need to install that as well:
```
npm install -g typescript
```

After that, it is a matter of compiling the script form the `public` folder and starting up the server:
```
cd public
tsc
cd ..
node .
```
The server will start on port 3030, and you should be able to launch the app by pointing your browser to [http://localhost:3030](http://localhost:3030)