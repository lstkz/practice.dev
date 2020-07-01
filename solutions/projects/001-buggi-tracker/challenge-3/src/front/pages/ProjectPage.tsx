import * as R from 'remeda';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '../contexts/RouterContext';
import { Dashboard } from '../components/Dashboard';
import { Link } from '../components/Link';
import { ApiClient } from '../ApiClient';
import { User } from '../../types';
import { AddMemberForm } from './AddMemberForm';

interface ProjectFormValues {
  name: string;
  owner: string;
}

export function ProjectPage() {
  const [users, setUsers] = React.useState([] as User[]);
  const [members, setMembers] = React.useState([] as User[]);
  const [formError, setFormError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { push, pathname } = useRouter();
  const id = R.last(pathname.split('/'));
  const isNew = id === 'new';
  const [isLoaded, setIsLoaded] = React.useState(isNew);

  const { handleSubmit, register, errors, setValue, setError } = useForm<
    ProjectFormValues
  >({
    defaultValues: {
      owner: '',
    },
  });

  React.useEffect(() => {
    ApiClient.getUsers().then(ret => {
      setUsers(ret);
      if (!isNew) {
        ApiClient.getProject(Number(id)).then(ret => {
          setIsLoaded(true);
          setValue('name', ret.name);
        });
      } else {
        setIsLoaded(true);
      }
    });
  }, []);

  const onSubmit = async (values: ProjectFormValues) => {
    await ApiClient.createProject({
      name: values.name,
      ownerId: Number(values.owner),
      memberIds: members.map(x => x.id),
    });
    push('/projects');
  };
  return (
    <Dashboard>
      <div className="page project-page">
        <div
          className="breadcrumb"
          data-test="breadcrumb"
          data-test-dir="top-center"
        >
          <Link data-test="bc-1" data-test-dir="top" href="/">
            Home
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link data-test="bc-2" data-test-dir="top" href="/users">
            Users
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <span data-test="bc-3" data-test-dir="top">
            {isNew ? 'Add User' : 'Edit User'}
          </span>
        </div>
        {isLoaded && (
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="textbox" data-test="name">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                ref={register({
                  validate: (value: string) => {
                    if (!value) {
                      return 'Name is required';
                    }
                    return true;
                  },
                })}
              />
              {errors.name && (
                <div data-test="error" className="error">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="select" data-test="owner">
              <label htmlFor="owner">Owner</label>
              <select
                id="owner"
                name="owner"
                ref={register({
                  required: 'Owner is required',
                })}
              >
                <option disabled value="">
                  select
                </option>
                {users
                  .filter(user => user.role === 'owner')
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </select>
              {errors.owner && (
                <div data-test="error" className="error">
                  {errors.owner.message}
                </div>
              )}
            </div>
            <div className="member-field">
              Members
              <ul>
                {members.map((item, i) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setMembers(members.filter(x => x.id !== item.id));
                    }}
                  >
                    <a
                      data-test={`del-member-btn-${i + 1}`}
                      data-test-dir="left"
                      href="#"
                      title="delete"
                    >
                      &#10005;
                    </a>{' '}
                    <span data-test={`member-${i + 1}`}>{item.username}</span>
                  </li>
                ))}
              </ul>
              <AddMemberForm
                onAdd={newMember => {
                  setMembers([...members, newMember]);
                }}
                users={users.filter(
                  user =>
                    user.role === 'reporter' &&
                    members.every(x => x.id !== user.id)
                )}
              />
            </div>
            <button
              disabled={isLoading}
              className="btn btn-primary"
              data-test="save-btn"
              type="submit"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </Dashboard>
  );
}
