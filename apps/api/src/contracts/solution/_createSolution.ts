// import * as R from 'remeda';
// import { rethrowTransactionCanceled } from '../../common/helper';
// import { SolutionEntity, SolutionTagStatsEntity } from '../../entities';
// import { createTransaction } from '../../lib';
// import { Transaction } from '../../orm/Transaction';
// import { TABLE_NAME } from '../../config';

// interface CreateSolutionValues {
//   createdAt: number;
//   likes: number;
//   id: string;
//   title: string;
//   slug: string;
//   url: string;
//   description?: string;
//   tags: string[];
//   userId: string;
//   challengeId: number;
// }

// function _addTagStats(
//   t: Transaction,
//   challengeId: number,
//   addTags: string[],
//   removeTags: string[]
// ) {
//   const tags = [
//     ...addTags.map(tag => ({ tag, add: 1 })),
//     ...removeTags.map(tag => ({ tag, add: -1 })),
//   ];
//   tags.forEach(({ tag, add }) => {
//     t.updateRaw({
//       tableName: TABLE_NAME,
//       key: SolutionTagStatsEntity.createKey({
//         challengeId,
//         tag,
//       }),
//       updateExpression: [
//         'SET #count = if_not_exists(#count, :zero) + :incr',
//         'challengeId = :challengeId',
//         '#data = :tag',
//       ].join(', '),
//       expressionNames: {
//         '#count': 'count',
//         '#data': 'data',
//       },
//       expressionValues: {
//         ':incr': add,
//         ':zero': 0,
//         ':challengeId': challengeId,
//         ':tag': tag,
//       },
//     });
//   });
// }

// export async function _createSolution(values: CreateSolutionValues) {
//   const props = {
//     ...R.omit(values, ['id']),
//     solutionId: values.id,
//   };
//   const solution = new SolutionEntity(props);
//   const solutionSlug = new SolutionEntity(props, { type: 'slug' });
//   const t = createTransaction();
//   t.insert(solutionSlug, {
//     conditionExpression: 'attribute_not_exists(pk)',
//   });
//   t.insert(solution);
//   await t
//     .commit()
//     .catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));
//   return solution;
// }
