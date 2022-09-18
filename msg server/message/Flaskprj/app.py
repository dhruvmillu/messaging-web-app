from flask import Flask,request, render_template
from flask_socketio import SocketIO,send,emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app,cors_allowed_origins="*")
online = {}
@socketio.on('connect')
def connect():
    print(request.sid, "connected")
@socketio.on('disconnect')
def disconnect():
    print(request.sid, "disconnected")
    user = request.sid
    for key in online.keys():
        if online[key] == user:
            del online[key]
            break
    print(online)
@socketio.on('message')
def message(msg,usr,me):
    print(request.sid, msg,online[usr])
    emit('display',{"message":msg['value'],"type":msg["type"],"id":me},to=online[usr])
@socketio.on('setUser')
def setUser(user,id):
    online[user]=id
    print(online)

if __name__ == '__main__':
    socketio.run(app)