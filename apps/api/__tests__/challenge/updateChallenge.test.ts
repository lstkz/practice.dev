// import {
//   resetDb,
//   assertFirstError,
//   setChallengeStats,
//   addContext,
// } from '../helper';
// import { server } from '../../app';
// import { getChallengeById } from '../../contracts/challenge/getChallengeById';
// import { registerSampleUsers } from '../seed-data';
// import { makeAdmin } from '../../contracts/user/makeAdmin';
// import { getUserByToken } from '../../contracts/user/getUserByToken';

// beforeEach(async () => {
//   await resetDb();
//   await registerSampleUsers();
//   const user = await getUserByToken('user1_token');
//   await makeAdmin(user!.id);
// });

// const UPDATE_CHALLENGE = `mutation ($values: UpdateChallengeValues!) {
//   updateChallenge(values: $values)
// }
// `;

// async function execUpdate(input: any, token: string) {
//   addContext(server, token);
//   const { errors, data } = await server.executeOperation({
//     query: UPDATE_CHALLENGE,
//     variables: {
//       values: input,
//     },
//   });
//   expect(errors).toBeFalsy();
//   expect(data).toBeDefined();
//   expect(data!.updateChallenge).toBeDefined();
//   return data!.updateChallenge;
// }

// async function assertSubmitError(input: any, token: string, errorMessage: any) {
//   addContext(server, token);
//   const ret = await server.executeOperation({
//     query: UPDATE_CHALLENGE,
//     variables: {
//       values: input,
//     },
//   });
//   assertFirstError(ret, errorMessage);
// }

// it('create and update a challenge', async () => {
//   Date.now = () => 123;
//   await execUpdate(
//     {
//       id: 1,
//       title: 'foo',
//       description: 'desc',
//       bundle: 'http://example.org',
//       tests: 'http://example.org/tests',
//       tags: ['frontend'],
//     },
//     'user1_token'
//   );

//   const challenge = await getChallengeById(null, 1);
//   expect(challenge).toEqual({
//     id: 1,
//     title: 'foo',
//     description: 'desc',
//     bundle: 'http://example.org',
//     tags: ['frontend'],
//     createdAt: 123,
//     isSolved: false,
//     stats: {
//       submissions: 0,
//       solutions: 0,
//       solved: 0,
//       likes: 0,
//     },
//   });

//   // update stats
//   await setChallengeStats(1, {
//     submissions: 1,
//     solutions: 2,
//     solved: 3,
//     likes: 4,
//   });

//   await execUpdate(
//     {
//       id: 1,
//       title: 'bar',
//       description: 'desc2',
//       bundle: 'http://example2.org',
//       tests: 'http://example.org',
//       tags: ['frontend', 'frontend2'],
//     },
//     'user1_token'
//   );

//   const challenge2 = await getChallengeById(null, 1);
//   expect(challenge2).toEqual({
//     id: 1,
//     title: 'bar',
//     description: 'desc2',
//     bundle: 'http://example2.org',
//     tags: ['frontend', 'frontend2'],
//     createdAt: 123,
//     isSolved: false,
//     stats: {
//       submissions: 1,
//       solutions: 2,
//       solved: 3,
//       likes: 4,
//     },
//   });
// });

// it('should throw error if not admin', async () => {
//   await assertSubmitError(
//     {
//       id: 1,
//       title: 'bar',
//       description: 'desc2',
//       bundle: 'http://example2.org',
//       tests: 'http://example.org',
//       tags: ['frontend', 'frontend2'],
//     },
//     'user2_token',
//     'Admin only'
//   );
// });
