var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var awesome = require('./routes/awesome');

var app = express();
var server = require('http').createServer(app),
io = require('socket.io').listen(server);

var userNames = [];
server.listen(3001);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);
//app.use('/users', users);
//app.use('/awesomeChat',awesome);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});


io.sockets.on('connection',function(socket){
  //onsole.log("new message");
 
   function updateUserNames()
   {
      io.sockets.emit("username", userNames)
   }

  socket.on('send message',function(data){
       //console.log("new chat message");
        io.sockets.emit('new message',{msg:data,nickName:socket.nickname});
  });

  
  socket.on('new user',function(data,callBack){
       if(userNames.indexOf(data) != -1)
       {
          callBack(false);          
       }
       else
       {
          callBack(true);
          userNames.push(data);
          socket.nickname = data;
          updateUserNames();
       }
     
  });

  socket.on("disconnect",function(e)
    {
        if(!userNames.indexOf(socket.nickname))
        {
          return;
        }
        else
        {
            userNames.splice(userNames.indexOf(socket.nickname),1);
            updateUserNames();
        }

    });

 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
