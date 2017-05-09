const EventEmitter = require('events');
const getUser = require('./user');

export default class Transport extends EventEmitter {
    constructor() {
        super();
        this.uuid = null;
        const protocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
        this.ws = new window.WebSocket(`${protocol}//${window.location.hostname}:${window.location.port}`);

        this.ws.onopen = () => {
            this.once('uuid', () => {
                this.emit('open');
            });
            this.on('broadcast', () => {
                console.log('broadcast response')
            })
            this.send({
                event: 'login',
                user: getUser()
            });
        };

        this.ws.onmessage = (message) => {

            let ev;
            try {
                ev = JSON.parse(message.data);
            } catch(err) {
                this.emit('error', err, { reason: 'failed to parse message' });
                return;
            }

            if (ev.uuid) {
                this.uuid = ev.uuid;
                this.emit('uuid', this.uuid);
                return;
            }
            else if (ev.broadcastResponse) {
                const answer = ev.broadcastResponse;
                this.emit('broadcasting', answer);
            }
            else if (ev.viewableBroadcast) {
                const ans = ev.viewableBroadcast;
                this.emit('viewableBroadcast', ans);

            }

            this.emit('message', ev);
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