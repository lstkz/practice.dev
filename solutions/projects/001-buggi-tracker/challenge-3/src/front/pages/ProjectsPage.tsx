import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Project } from '../../types';
import { ApiClient } from '../ApiClient';
import { Link } from '../components/Link';
import { useUser } from '../hooks';

export function ProjectsPage() {
  const [projects, setProjects] = React.useState([] as Project[]);
  const user = useUser();

  React.useEffect(() => {
    ApiClient.getProjects().then(ret => {
      setProjects(ret);
    });
  }, []);

  return (
    <>
      <Dashboard>
        <div className="page projects-page">
          <div
            className="breadcrumb"
            data-test="breadcrumb"
            data-test-dir="top-center"
          >
            <Link data-test="bc-1" data-test-dir="top" href="/">
              Home
            </Link>
            <span className="breadcrumb__separator">&gt;</span>
            <span data-test="bc-2" data-test-dir="top">
              Projects
            </span>
          </div>
          {user.role === 'admin' && (
            <Link
              href="/projects/new"
              data-test="add-project-btn"
              className="btn btn-primary"
            >
              + Add Project
            </Link>
          )}
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item, i) => {
                const suffix = '-' + (i + 1);
                return (
                  <tr key={item.id}>
                    <td>
                      <span data-test={'name' + suffix}>{item.name}</span>
                    </td>
                    <td>
                      <span data-test={'owner' + suffix}>
                        {item.owner.username}
                      </span>
                    </td>
                    <td>
                      {user.role === 'admin' && (
                        <>
                          <a
                            href="#"
                            data-test={'delete-btn' + suffix}
                            data-test-dir="left"
                            onClick={() => {}}
                          >
                            Delete
                          </a>{' '}
                          |{' '}
                        </>
                      )}
                      {(user.role === 'admin' || user.role === 'owner') && (
                        <Link
                          href={`/users/${item.id}`}
                          data-test={'edit-btn' + suffix}
                        >
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Dashboard>
    </>
  );
}
