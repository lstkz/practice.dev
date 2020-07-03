import { useRouter } from '../contexts/RouterContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dashboard } from '../components/Dashboard';
import { Project } from '../../types';
import { ApiClient } from '../ApiClient';
import { Breadcrumb } from '../components/Breadcrumb';

interface IssueFormValues {
  title: string;
  description: string;
}

export function AddIssuePage() {
  const { push, pathname } = useRouter();
  const [project, setProject] = React.useState(null as Project);
  const projectId = Number(pathname.split('/')[2]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    ApiClient.getProject(projectId).then(ret => {
      setProject(ret);
    });
  }, []);

  const { handleSubmit, register, errors, setValue, setError } = useForm<
    IssueFormValues
  >({});

  const onSubmit = async (values: IssueFormValues) => {
    setIsLoading(true);
    try {
      await ApiClient.createIssue(projectId, values);
      push('/projects/' + projectId + '/issues');
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Dashboard>
      {project && (
        <div className="page add-issue-page">
          <Breadcrumb
            path={[
              { url: '/', text: 'Home' },
              { url: '/projects', text: 'Projects' },
              {
                url: '/projects/' + project.id + '/issues',
                text: project.name + ' - Issues',
              },
              'Add Issue',
            ]}
          />
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="textbox" data-test="title">
              <label htmlFor="name">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                ref={register({
                  validate: (value: string) => {
                    if (!value) {
                      return 'Title is required';
                    }
                    return true;
                  },
                })}
              />
              {errors.title && (
                <div data-test="error" className="error">
                  {errors.title.message}
                </div>
              )}
            </div>
            <div className="textbox" data-test="description">
              <label htmlFor="name">Description</label>
              <textarea
                id="description"
                name="description"
                ref={register({
                  validate: (value: string) => {
                    if (!value) {
                      return 'Description is required';
                    }
                    return true;
                  },
                })}
              />
              {errors.description && (
                <div data-test="error" className="error">
                  {errors.description.message}
                </div>
              )}
            </div>
            <button
              disabled={isLoading}
              className="btn btn-primary"
              data-test="post-btn"
              type="submit"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </Dashboard>
  );
}
