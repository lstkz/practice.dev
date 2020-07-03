import React from 'react';
import * as R from 'remeda';
import { Dashboard } from '../components/Dashboard';
import { Breadcrumb } from '../components/Breadcrumb';
import { useRouter } from '../contexts/RouterContext';
import { Project, Issue } from '../../types';
import { ApiClient } from '../ApiClient';

export function IssuePage() {
  const { pathname } = useRouter();
  const [project, setProject] = React.useState(null as Project);
  const [issue, setIssue] = React.useState(null as Issue);
  const projectId = Number(pathname.split('/')[2]);
  const issueId = Number(R.last(pathname.split('/')));

  React.useEffect(() => {
    Promise.all([
      ApiClient.getProject(projectId),
      ApiClient.getIssue(projectId, issueId),
    ]).then(([project, issue]) => {
      setIssue(issue);
      setProject(project);
    });
  }, []);

  return (
    <Dashboard>
      {project && (
        <div className="page issue-page">
          <Breadcrumb
            path={[
              { url: '/', text: 'Home' },
              { url: '/projects', text: 'Projects' },
              {
                url: '/projects/' + project.id + '/issues',
                text: project.name + ' - Issues',
              },
              '#' + issue.issueId,
            ]}
          />
          <div></div>
          <h1 className="issue-title" data-test="issue-title">
            {issue.title} <span>#{issue.issueId}</span>
          </h1>
          <div className="issue-post" data-test="post-1">
            <div className="issue-post__author">
              <span data-test="author">{issue.author.username}</span>
            </div>
            <div
              className="issue-post__description"
              data-test="desc"
              data-test-dir="top-center"
            >
              {issue.description}
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}
