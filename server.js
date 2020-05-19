const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app) // Create a http server for express
const io = require('socket.io')(server) // Create a WSS server for the socket

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine','html')

app.use('/', (req, res) =>{
    res.render('index.html')
})

let messages =[];
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)
    /* descrição do que ta acontecendo: ele envia tds a msg pra pessoa quando um conexão é feita, dps o sendmessage escuta se n tá vindo alguma msg do front, se vier ele manda pra td mundo */
    console.log(messages);
    
    socket.emit('previousMessages', messages)
    socket.on('sendMessage', data =>{ // on é para receber e escutar, emit é pra emitir para esse data, e broadcast emit emite pra td mundo
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data);
    })
})

server.listen(3333)