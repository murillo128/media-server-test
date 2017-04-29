const EventEmitter = require('events');
const getUser = require('./user');

export default class Transport extends EventEmitter {
    constructor() {
        super();
        this.uuid = null;
        const protocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
        this.ws = new window.WebSocket(`${protocol}//${window.location.hostname}:8080`);

        this.ws.onopen = () => {
            this.once('uuid', () => {
                this.emit('open');
            });
            this.send({
                event: 'login',
                user: getUser() || 'guest'
            });
        };
    }

    send(event) {
        this.ws.send(JSON.stringify(event));
    }

    close() {
        this.ws.close();
        this.ws = null;
    }
}