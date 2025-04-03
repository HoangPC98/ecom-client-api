import { RpcException } from '@nestjs/microservices';

export class GrpcException extends Error {
  constructor(error: any) {
    super(error)
    console.error('--> GrpcError: ', error);
  }
}

export class GrpcBadRequestException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 400, details: error });
  }
}

export class GrpcUnauthorizeException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 401, details: error });
  }
}

export class GrpcInvalidAgrsException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 402, details: error });
  }
}

export class GrpcForbbienException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 403, details: error });
  }
}

export class GrpcNotFoundException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 406, details: error });
  }
}

export class GrpcNotAceptableException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 406, details: error });
  }
}

export class GrpcInternalServerException extends GrpcException {
  constructor(error: any) {
    super(error)
    throw new RpcException({ code: 500, details: error });
  }
}