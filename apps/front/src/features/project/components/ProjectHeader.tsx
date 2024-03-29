import * as React from 'react';
import styled from 'styled-components';
import { getProjectState } from '../interface';
import { DomainIcon } from 'src/components/DomainIcon';
import { SubmissionStats } from 'src/components/SubmissionStats';
import { useProjectStats } from 'src/hooks/useProjectStats';
import { SolvedTag } from 'src/components/SolvedTag';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { IconCounter } from 'src/components/IconCounter';
import { Theme, MOBILE } from 'src/Theme';

interface ProjectHeaderProps {
  className?: string;
}

const Col1 = styled.div`
  width: 30px;
  flex-shrink: 0;
  padding-top: 5px;
`;
const Col2 = styled.div`
  flex-grow: 1;
  margin-left: 25px;
`;
const Col3 = styled.div`
  width: 300px;
  flex-shrink: 0;
  padding-top: 10px;
  ${SolvedTag} {
    margin-left: 30px;
  }
`;

const Col3Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin: 0;
  color: ${Theme.textDark};
  margin-right: 10px;
`;

const Desc = styled.div`
  margin-top: 24px;
  color: ${Theme.textLight};
  align-items: center;
  justify-content: center;
  white-space: pre-line;
`;

const MobileRow1 = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 20px;
  }
`;
const MobileRow2 = styled.div``;
const MobileRow3 = styled.div`
  display: flex;
  margin-top: 10px;
  ${IconCounter} {
    justify-content: flex-start;
  }
`;

const _ProjectHeader = (props: ProjectHeaderProps) => {
  const { className } = props;
  const { project } = getProjectState.useState();
  const { solved, submissions } = useProjectStats(project);
  const isMobile = useIsMobile();

  return (
    <div className={className} data-test="project">
      {isMobile ? (
        <>
          <MobileRow1>
            <DomainIcon domain={project.domain} />
            <Title data-test="title">{project.title}</Title>
            {project.solvedPercent > 0 && (
              <SolvedTag percent={project.solvedPercent} large />
            )}
          </MobileRow1>
          <MobileRow2>
            <Desc>{project.description}</Desc>
          </MobileRow2>
          <MobileRow3>
            <SubmissionStats submissions={submissions} solved={solved} />
          </MobileRow3>
        </>
      ) : (
        <>
          <Col1>
            <DomainIcon domain={project.domain} />
          </Col1>
          <Col2>
            <Title data-test="title">{project.title}</Title>
            <Desc>{project.description}</Desc>
          </Col2>
          <Col3>
            <Col3Inner>
              <SubmissionStats submissions={submissions} solved={solved} />
              {project.solvedPercent > 0 && (
                <SolvedTag percent={project.solvedPercent} large />
              )}
            </Col3Inner>
          </Col3>
        </>
      )}
    </div>
  );
};

export const ProjectHeader = styled(_ProjectHeader)`
  width: 100%;
  display: flex;
  padding: 20px 30px 40px 25px;
  background: ${Theme.bgLightGray10};
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border-bottom: 1px solid ${Theme.grayLight};
  ${MOBILE} {
    flex-direction: column;
  }
`;
