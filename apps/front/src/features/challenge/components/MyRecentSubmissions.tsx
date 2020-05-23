// import * as React from 'react';
// import styled from 'styled-components';
// import { SidebarTitle } from './SidebarTitle';
// import { Theme } from 'ui';
// import { getChallengeState } from '../interface';
// import { MySubmission } from './MySubmission';
// import { useUser } from 'src/hooks/useUser';

// interface MyRecentSubmissionsProps {
//   className?: string;
// }

// const Na = styled.div`
//   color: ${Theme.grayLight};
// `;

// const _MyRecentSubmissions = (props: MyRecentSubmissionsProps) => {
//   const { className } = props;
//   const { recentSubmissions } = getChallengeState.useState();
//   const user = useUser();
//   if (!user) {
//     return null;
//   }
//   return (
//     <div className={className} data-test="recent-submissions">
//       <SidebarTitle>My Recent Submissions</SidebarTitle>
//       {recentSubmissions.length ? (
//         recentSubmissions.map(item => (
//           <MySubmission key={item.id} submission={item} />
//         ))
//       ) : (
//         <Na data-test="empty">N/A</Na>
//       )}
//     </div>
//   );
// };

// export const MyRecentSubmissions = styled(_MyRecentSubmissions)`
//   display: block;
//   ${SidebarTitle} {
//     margin-bottom: 20px;
//   }
// `;
