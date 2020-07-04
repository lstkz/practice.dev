import React from 'react';
import { useForm } from 'react-hook-form';
import { ApiClient } from '../ApiClient';
import { useAppDispatch } from '../contexts/AppContext';
import { useRouter } from '../contexts/RouterContext';

interface LoginFormValues {
  username: string;
  password: string;
}

export function LoginPage() {
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { push } = useRouter();
  const { handleSubmit, register, errors } = useForm<LoginFormValues>();
  const appDispatch = useAppDispatch();
  const onSubmit = async (values: LoginFormValues) => {
    setError('');
    setIsLoading(true);
    try {
      const ret = await ApiClient.login(values.username, values.password);
      localStorage.token = ret.token;
      appDispatch({
        type: 'user-loaded',
        user: ret.user,
      });
      push('/');
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Buggi Login</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div data-test="login-error" className="alert">
            {error}
          </div>
        )}
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
        <div className="textbox" data-test="password">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            ref={register({
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <div data-test="error" className="error">
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          disabled={isLoading}
          className="btn btn-primary"
          data-test="login-btn"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
