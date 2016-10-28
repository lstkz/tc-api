/**
 * Represents the socket server
 */
import socketIO from 'socket.io';


let io;


// ------------------------------------
// Exports
// ------------------------------------
export default {
  startUp,
  notifyUpdate,
};


// ------------------------------------
// Public
// ------------------------------------

/**
 * Setup and start the socket server
 * @param {Object} server the http server from express
 */
function startUp(server) {
  io = socketIO(server);
}

/**
 * Notify update of challenge to all sockets
 * @param {Object} challenge the challenge to notify
 */
function notifyUpdate(challenge) {
  io.emit('challenge-update', challenge);
}
