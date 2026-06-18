import { Server } from "socket.io";

let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io =  new Server(server , {
        cors: {
            origin: "*",
            methods: ["GET" , "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        }
    });

    io.on("connection" , (socket) => {
        
        socket.on("join-call" , (path) => {
            console.log("something-connected");
            if(connections[path] === undefined) {
                connections[path] = []
            }

            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            for(let a=0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined" , socket.id , connections[path])
            }

            if(messages[path] !== undefined) {
                for(let a=0; a < messages[path].length; a++) {
                    const msg = messages[path][a];
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg['socket-id-sender']);
                }
            }
        });

        socket.on("signal" , (toId , message) => {
            io.to(toId).emit("signal" , socket.id , message);
        })

        socket.on("chat-message" , (data , sender) => {
            const [matchingRoom , found] = Object.entries(connections)
                .reduce(([room , isFound] , [roomKey , roomValue]) => {
                    
                    if(!isFound && roomValue.includes(socket.id)) {
                        return [roomKey , true];
                    }

                    return [room , isFound];
                } , ['' , false]);

            if(found === true) {
                if(messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({"sender" : sender , "data" : data , "socket-id-sender" : socket.id});
                
                console.log(messages[matchingRoom]);
                connections[matchingRoom].forEach((participant) => {
                    io.to(participant).emit("chat-message" , data , sender , socket.id);
                })
            }
        })

        socket.on("disconnect" , () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            var key;

            for (const [roomKey , roomValue] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for(let participant = 0; participant < roomValue.length; participant++) {
                    if(roomValue[participant] === socket.id) {
                        key = roomKey;

                        for(let p=0; p < connections[key].length; p++) {
                            io.to(connections[key][p]).emit("user-left" , socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index , 1);

                        if(connections[key].length === 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        })
    });


    return io;
}