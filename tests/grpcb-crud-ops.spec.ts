/*
 -  dependencies
*/
import { test, expect, request } from '@playwright/test';
// defining base url
const baseURL = 'https://grpcb.in'; // Adjust the domain/port if necessary.
// test suite for separate api
test.describe('ABitOfEverythingService HTTP tests', () => {
  let apiContext;
  // hook to load the api url
  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL });
  });

  test('CreateBody, Lookup, Update, and Delete', async () => {
    // Use CreateBody to create a resource.
    const uuid = 'test-uuid-1234';
    const createPayload = {
      uuid: uuid,
      float_value: 1.0,
      double_value: 2.0,
      int64_value: 1234,
      uint64_value: 1234,
      int32_value: 123,
      fixed64_value: 1000,
      fixed32_value: 100,
      bool_value: true,
      string_value: "hello",
      uint32_value: 123,
      sfixed32_value: 321,
      sfixed64_value: 432,
      sint32_value: -10,
      sint64_value: -20,
      nonConventionalNameValue: "nonConventional"
      // Other optional fields are omitted for brevity.
    };

    // Call CreateBody
    const createResponse = await apiContext.post('/v1/example/a_bit_of_everything', {
      data: createPayload,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(createResponse.status()).toBe(200);
    const createdBody = await createResponse.json();
    expect(createdBody.uuid).toBe(uuid);

    // Lookup using the created uuid.
    const lookupResponse = await apiContext.get(`/v1/example/a_bit_of_everything/${uuid}`);
    expect(lookupResponse.status()).toBe(200);
    const lookupBody = await lookupResponse.json();
    expect(lookupBody.uuid).toBe(uuid);

    // Update – change the string_value.
    const updatePayload = { ...createPayload, string_value: "updated-hello" };
    const updateResponse = await apiContext.put(`/v1/example/a_bit_of_everything/${uuid}`, {
      data: updatePayload,
      headers: { 'Content-Type': 'application/json' }
    });
    // For methods returning google.protobuf.Empty, a 200 or 204 is acceptable.
    expect([200, 204]).toContain(updateResponse.status());

    // Verify the update via lookup.
    const lookupResponse2 = await apiContext.get(`/v1/example/a_bit_of_everything/${uuid}`);
    expect(lookupResponse2.status()).toBe(200);
    const lookupBody2 = await lookupResponse2.json();
    expect(lookupBody2.string_value).toBe("updated-hello");

    // delete the created resource
    const deleteResponse = await apiContext.delete(`/v1/example/a_bit_of_everything/${uuid}`);
    expect([200, 204]).toContain(deleteResponse.status());

    // expect 404 -  assertion to verify delete operation
    const lookupResponse3 = await apiContext.get(`/v1/example/a_bit_of_everything/${uuid}`);
    expect(lookupResponse3.status()).toBe(404);
  });

  test('Echo method', async () => {

    const echoValue = 'echo-test';
    const echoResponse = await apiContext.get(`/v1/example/a_bit_of_everything/echo/${echoValue}`);
    expect(echoResponse.status()).toBe(200);
    const echoBody = await echoResponse.json();
    // Assuming the response is a JSON object like { "value": "echo-test" }
    expect(echoBody.value).toBe(echoValue);
  });
// post method
  test('DeepPathEcho method', async () => {
    const nestedName = "deepEcho";
    const deepPayload = {
      uuid: "dummy-uuid",
      single_nested: { name: nestedName, amount: 10, ok: 1 }, // Using 1 for TRUE
      // Minimal additional fields can be added if required.
    };
    const deepResponse = await apiContext.post(`/v1/example/a_bit_of_everything/${nestedName}`, {
      data: deepPayload,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(deepResponse.status()).toBe(200);
    const deepBody = await deepResponse.json();
    expect(deepBody.single_nested.name).toBe(nestedName);
  });
  // get to check timeout
  test('Timeout method', async () => {

    const timeoutResponse = await apiContext.get('/v2/example/timeout');
    expect(timeoutResponse.status()).toBe(200);
  });
  // simple get method
  test('ErrorWithDetails method', async () => {

    const errorResponse = await apiContext.get('/v2/example/errorwithdetails');
    // Check that the response is not successful (e.g. 4xx or 5xx).
    expect(errorResponse.status()).not.toBe(200);
  });
// get method
  test('GetMessageWithBody method', async () => {

    const id = "msg-1";
    const dataPayload = { name: "test" };  
    const messageResponse = await apiContext.post(`/v2/example/withbody/${id}`, {
      data: dataPayload,
      headers: { 'Content-Type': 'application/json' }
    });
    expect(messageResponse.status()).toBe(200);
  });
// check empty body
  test('PostWithEmptyBody method', async () => {

    const nameParam = "emptyBodyTest";
    const postResponse = await apiContext.post(`/v2/example/postwithemptybody/${nameParam}`, {
      data: {}, 
      headers: { 'Content-Type': 'application/json' }
    });
    expect(postResponse.status()).toBe(200);
  });
});
