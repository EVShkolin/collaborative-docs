import { createHocuspocusServer } from './server';
import { createRabbitmqConnection, registerConsumers } from './rabbitmq/consumer';

const serverPort = parseInt(process.env.POSTGRES_SERVER_PORT!);
const rabbitmqUrl = process.env.MESSENGER_TRANSPORT_DSN;

const server = createHocuspocusServer();
server.listen(serverPort);

const rabbit = createRabbitmqConnection(rabbitmqUrl!);

registerConsumers(rabbit, server);
