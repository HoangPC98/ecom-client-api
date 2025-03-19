import { Injectable } from "@nestjs/common";
import { Channel, Connection } from "amqplib";
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { MESSSAGE_SERVICE_QUEUE, QUEUE_SEND_SMS, rabbitmqUri } from ".";
@Injectable()
export class QueueMessageService {
  public rmqChannel: ChannelWrapper;
  public readonly DIRECT_EXCH = 'direct_exchange';
  constructor(){
    this.initConnection();
  }

  async initConnection() {
    const connection = amqp.connect(rabbitmqUri());
    this.rmqChannel = connection.createChannel({
      setup: (channel: Channel) => {
        channel.assertExchange('1234', 'direct', {
          durable: false
        });
      },
    });
    // return this.rmqChannel.assertQueue('', { durable: true });
  }

  publishMsgDirect(rkey: string, msg: any) {
    this.rmqChannel.publish(this.DIRECT_EXCH, rkey, Buffer.from(JSON.stringify({ msg })))
  }

  publishMsgToQueue(queue: string, msg: any) {
    console.log('Message: ', msg)
    this.rmqChannel.sendToQueue(queue,  Buffer.from(JSON.stringify(msg)))
  }
}