import * as R from 'remeda';
import { useRouter } from '../contexts/RouterContext';
import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Link } from '../components/Link';
import { useForm } from 'react-hook-form';
import { ApiClient } from '../ApiClient';

interface UserFormValues {
  username: string;
  role: string;
}

export function UserPage() {
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { push, pathname } = useRouter();
  const id = R.last(pathname.split('/'));
  const isNew = id === 'new';
  const [isLoaded, setIsLoaded] = React.useState(isNew);
  const { handleSubmit, register, errors, setValue } = useForm<UserFormValues>({
    defaultValues: {
      role: '',
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setError('');
    setIsLoading(true);
    try {
      if (isNew) {
        await ApiClient.createUser(values);
      } else {
        await ApiClient.updateUser(Number(id), values);
      }
      push('/users');
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isNew) {
      ApiClient.getUser(Number(id)).then(ret => {
        setIsLoaded(true);
        setValue('username', ret.username);
        setValue('role', ret.role);
      });
    }
  }, []);

  return (
    <Dashboard>
      <div className="page user-page">
        <div
          className="breadcrumb"
          data-test="breadcrumb"
          data-test-dir="top-center"
        >
          <Link data-test="item-1" data-test-dir="top" href="/">
            Home
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <Link data-test="item-2" data-test-dir="top" href="/users">
            Users
          </Link>
          <span className="breadcrumb__separator">&gt;</span>
          <span data-test="item-3" data-test-dir="top">
            {isNew ? 'Add User' : 'Edit User'}
          </span>
        </div>

        {isLoaded && (
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div data-test="user-error" className="alert">
                {error}
              </div>
            )}{' '}
            <div className="textbox" data-test="username">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                ref={register({
                  required: 'Username is required',
                })}
              />
              {errors.username && (
                <div data-test="error" className="error">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="select" data-test="role">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                ref={register({
                  required: 'Role is required',
                })}
              >
                <option disabled value="">
                  select
                </option>
                <option value="admin">admin</option>
                <option value="owner">owner</option>
                <option value="reporter">reporter</option>
              </select>
              {errors.role && (
                <div data-test="error" className="error">
                  {errors.role.message}
                </div>
              )}
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
