# Canvas Next
Simple collaboration drawing app, made using NextJS, React Konva and SocketIO with NextJS API Page for learning SocketIO and of course trying NextJS 13

## Feature
Currently its only have basic feature such as
- Freehand Draw
- Move in canvas
- Zoom
- Collaboration (limit only 2 user)

## How to
- just ``npm install ``

## Screenshoot
![image](https://user-images.githubusercontent.com/52363719/205450228-1c005a33-8ef7-4b05-8b7d-d0ff2b624a95.png)
![image](https://user-images.githubusercontent.com/52363719/205450256-ef3ac659-cf54-48e3-9691-8dee093e81f6.png)

## Known Bug 
- double connection made while connecting into socketIO. it happen when client connected to socketIO server, it would be counted as 2 connection with 2 different ID, im still confuse how to handle this, since there's no explanation in stakeoverflow or even official documentation. it really hard to implement auto refresh on waiting room with bug like this
