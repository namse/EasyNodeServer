{"changed":false,"filter":false,"title":"server.js","tooltip":"/server.js","value":"//\n// # SimpleServer\n//\n// A simple chat server using Socket.IO, Express, and Async.\n//\nvar http = require('http');\nvar path = require('path');\n\nvar async = require('async');\nvar socketio = require('socket.io');\nvar express = require('express');\n\n//\n// ## SimpleServer `SimpleServer(obj)`\n//\n// Creates a new instance of SimpleServer with the following options:\n//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.\n//\nvar router = express();\nvar server = http.createServer(router);\nvar io = socketio.listen(server);\n\nrouter.use(express.static(path.resolve(__dirname, 'client')));\nvar messages = [];\nvar sockets = [];\n\nio.on('connection', function (socket) {\n    messages.forEach(function (data) {\n      socket.emit('message', data);\n    });\n\n    sockets.push(socket);\n\n    socket.on('disconnect', function () {\n      sockets.splice(sockets.indexOf(socket), 1);\n      updateRoster();\n    });\n\n    socket.on('message', function (msg) {\n      var text = String(msg || '');\n\n      if (!text)\n        return;\n\n      socket.get('name', function (err, name) {\n        var data = {\n          name: name,\n          text: text\n        };\n\n        broadcast('message', data);\n        messages.push(data);\n      });\n    });\n\n    socket.on('identify', function (name) {\n      socket.set('name', String(name || 'Anonymous'), function (err) {\n        updateRoster();\n      });\n    });\n  });\n\nfunction updateRoster() {\n  async.map(\n    sockets,\n    function (socket, callback) {\n      socket.get('name', callback);\n    },\n    function (err, names) {\n      broadcast('roster', names);\n    }\n  );\n}\n\nfunction broadcast(event, data) {\n  sockets.forEach(function (socket) {\n    socket.emit(event, data);\n  });\n}\n\nserver.listen(process.env.PORT || 3000, process.env.IP || \"0.0.0.0\", function(){\n  var addr = server.address();\n  console.log(\"Chat server listening at\", addr.address + \":\" + addr.port);\n});\n","undoManager":{"mark":0,"position":-1,"stack":[]},"ace":{"folds":[],"scrolltop":37,"scrollleft":0,"selection":{"start":{"row":27,"column":4},"end":{"row":27,"column":12},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":1,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1415289414000}