const EventEmitter = require('events');
const emitter = new EventEmitter();

// emitter.on('bell-rang', () => {
//     console.log('bell rang, students should come to class');
// });

// emitter.on('bell-rang', () => {
//     console.log('bell rang, teachers can come to class');
// });

const informStudemts = (time,Date) => {
    console.log(`bell-rang at ${time},${Date}, students should come to class`);
};

emitter.on('bell-rang',informStudemts);
// const informTeachers = () => {
//     console.log('bell-rang, teachers can come to class');
// };

emitter.emit('bell-rang', '8:00AM', '2026-11-20');
emitter.emit('bell-rang', '9:00AM', '2023-11-20');
emitter.emit('bell-rang', '10:00AM', '2023-11-20');