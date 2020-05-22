import React from 'react';
import { IconCounter } from './IconCounter';
import { FileIcon } from 'src/icons/FileIcon';
import { UserIcon } from 'src/icons/UserIcon';

interface SubmissionStatsProps {
  submissions: number;
  solved: number;
}

export function SubmissionStats(props: SubmissionStatsProps) {
  const { solved, submissions } = props;
  return (
    <>
      <IconCounter
        icon={<FileIcon />}
        count={submissions}
        tooltip="Total Submissions"
        testId="submissions"
      />
      <IconCounter
        icon={<UserIcon />}
        count={solved}
        tooltip="User Solved"
        testId="solved"
      />
    </>
  );
}
