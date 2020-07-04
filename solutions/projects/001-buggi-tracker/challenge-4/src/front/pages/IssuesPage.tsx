import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Project, Issue } from '../../types';
import { ApiClient } from '../ApiClient';
import { Link } from '../components/Link';
import { useRouter } from '../contexts/RouterContext';
import { Breadcrumb } from '../components/Breadcrumb';

export function IssuesPage() {
  const [project, setProject] = React.useState(null as Project);
  const [issues, setIssues] = React.useState([] as Issue[]);
  const { pathname } = useRouter();
  const projectId = Number(pathname.split('/')[2]);

  React.useEffect(() => {
    ApiClient.getProject(projectId).then(ret => {
      setProject(ret);
    });
    ApiClient.getIssues(projectId).then(ret => {
      setIssues(ret);
    });
  }, []);

  return (
    <Dashboard>
      {project && (
        <div className="page issues-page">
          <Breadcrumb
            path={[
              { url: '/', text: 'Home' },
              { url: '/projects', text: 'Projects' },
              project.name + ' - Issues',
            ]}
          />
          <Link
            href={`/projects/${project.id}/issues/new`}
            data-test="add-issue-btn"
            className="btn btn-primary"
          >
            + Add Issue
          </Link>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((item, i) => {
                const suffix = '-' + (i + 1);
                return (
                  <tr key={item.issueId}>
                    <td>
                      <span data-test={'id' + suffix}>{item.issueId}</span>
                    </td>
                    <td>
                      <Link
                        href={`/projects/${item.projectId}/issues/${item.issueId}`}
                        data-test={'title' + suffix}
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <span data-test={'author' + suffix}>
                        {item.author.username}
                      </span>
                    </td>
                    <td>
                      <span data-test={'status' + suffix}>{item.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Dashboard>
  );
}
