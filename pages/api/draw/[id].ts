import { NextApiRequest, NextApiResponse } from "next";
import { Socket, Server as NextServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NextServer & {
      io: SocketIOServer;
    };
  };
};

type Req = {
  id: string;
};

let ids: any[] = [];
let waitIds:any[]=[]
let listMouseId: any = {};
let someoneDisconnected = false;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("creating new socket io server");
    const httpServer: HttpServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer);

    if (req.query.id) {
      const mainSpace = io.of(req.query.id.toString());

      mainSpace.on("connection", (socket) => {
        socket.broadcast.emit("total", ids);

        socket.on("adduser", function () {
          if (ids.length >2) {
            socket.emit("full", true);
            waitIds.push(socket.id)
          } else {
              if (ids.indexOf(socket.id) == -1) {
                ids.push(socket.id);
              }
              socket.emit("full", false);
            
          }
        });

        socket.on("disconnect", function () {
          ids = ids.filter((id) => id !== socket.id);
          waitIds = ids.filter((id) => id !== socket.id);
          delete listMouseId[socket.id];
          someoneDisconnected = true;
          if(someoneDisconnected){
            socket.broadcast.emit("reloading", waitIds);
          }
          
        });

        socket.on("mouseCollab", function (data) {
          listMouseId[socket.id] = { id: socket.id, ...data };
          socket.broadcast.emit("userMouseCollab", Object.values(listMouseId));
        });

        socket.on("initDrawCollab", function (data) {
          socket.broadcast.emit("newInitDrawCollab", {
            id: socket.id,
            ...data,
          });
        });

        socket.on("drawCollab", function (data) {
          socket.broadcast.emit("newDrawCollab", {
            id: socket.id,
            data: data,
          });
        });
      });
    }

    res.socket.server.io = io;
  }

  res.end();
}
