
/*
-   configure grpcb
*/
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

/*
-   I have selected this file because it contains the create methods
*/
const PROTO_PATH = './proto/a_bit_of_everything.proto'; // update if your path differs

// define the object containing variables
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new proto.grpcbin.ABitOfEverythingService(
  'grpcb.in:9000',
  grpc.credentials.createInsecure()
);

export function callCreate(payload: any) {
  return new Promise((resolve, reject) => {
    client.Create(payload, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}
