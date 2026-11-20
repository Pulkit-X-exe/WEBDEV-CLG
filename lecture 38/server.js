const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('bell-rang', () => {
    console.log('bell rang, students should come to class');
});

emitter.on('bell-rang', () => {
    console.log('bell rang, teachers can come to class');
});

emitter.emit('bell-rang');
