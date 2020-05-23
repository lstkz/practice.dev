// import * as React from 'react';
// import styled from 'styled-components';
// import { Submission, SubmissionStatus } from 'shared';
// import { Theme } from 'ui';
// import { Tag } from 'src/components/Tag';
// import * as DateFns from 'date-fns';

// interface MySubmissionProps {
//   className?: string;
//   submission: Submission;
// }

// const Ago = styled.div`
//   color: ${Theme.textLight};
//   margin-left: auto;
// `;

// const _MySubmission = (props: MySubmissionProps) => {
//   const { className, submission } = props;
//   const renderTag = () => {
//     switch (submission.status) {
//       case SubmissionStatus.Fail:
//         return (
//           <Tag testId="tag" type="fail">
//             FAIL
//           </Tag>
//         );
//       case SubmissionStatus.Pass:
//         return (
//           <Tag testId="tag" type="pass">
//             PASS
//           </Tag>
//         );
//       case SubmissionStatus.Queued:
//         return (
//           <Tag testId="tag" type="pending">
//             QUEUED
//           </Tag>
//         );
//       case SubmissionStatus.Running:
//         return (
//           <Tag testId="tag" type="pending">
//             RUNNING
//           </Tag>
//         );
//     }
//   };

//   const ago = React.useMemo(() => {
//     return DateFns.formatDistanceToNow(new Date(submission.createdAt), {
//       addSuffix: true,
//     });
//   }, []);

//   return (
//     <div className={className} data-test={`submission-${submission.id}`}>
//       {renderTag()}
//       <Ago>{ago}</Ago>
//     </div>
//   );
// };

// export const MySubmission = styled(_MySubmission)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   ${Tag} {
//     margin-right: 0;
//   }
//   margin-bottom: 10px;
// `;
