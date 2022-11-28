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

let count=0
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const httpServer: HttpServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer);


    if(req.query.id){
      const id = req.query.id as string;
      const drawSpace = io.of(id);
  
      drawSpace.on("connection", (socket) => {
        console.log("creating new socket io servers");
        count+=1;

        socket.on("disconnect",()=>{
          console.log("disconnecting")
          count-=1;
          
        })
        
        socket.broadcast.emit("total", `total: ${count}`);
  
        socket.on("dc", () => {
          socket.disconnect();
        });
      });

      
  
      res.socket.server.io = io;
    }
  }

  res.end();
}
