export const PUBLIC_API = 'PUBLIC_API';
export const DEVICE_ID = 'device_id';
export const PROTO_PATH_CUSTOMER = process.env.NODE_ENV == 'local' ? process.cwd() + '/../' + '/ecom-protos-grpc/customer/customer.proto' : process.cwd() + '/proto/customer/customer.proto';
