import * as dotEnv from 'dotenv';
dotEnv.config();

export const MESSSAGE_SERVICE_QUEUE = 'MESSSAGE_SERVICE';
export const MESSSAGE_SERVICE = 'MESSSAGE_SERVICE_NAME';
export const QUEUE_SEND_SMS = 'QUEUE_SEND_SMS';
export const QUEUE_SEND_MAIL = 'QUEUE_SEND_MAIL';
export const QUEUE_PUSH_NOTIF = 'QUEUE_PUSH_NOTIF';

export const RoutingKey = {
  SEND_OTP_SMS: 'SEND_OTP_SMS',
};

const user = process.env.RABBITMQ_DEFAULT_USER;
const pass = process.env.RABBITMQ_DEFAULT_PASS;
const host = process.env.RABBITMQ_HOST;
const port = process.env.RABBITMQ_PORT;

export const rabbitmqUri = (): string => {
  return `amqp://${user}:${pass}@${host}:${port}`;
};
