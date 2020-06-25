import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Link } from '../components/Link';
import { User } from '../../types';
import { ApiClient } from '../ApiClient';
import { ConfirmModal } from '../components/ConfirmModal';
import { useUser } from '../hooks';

export function UsersPage() {
  const [users, setUsers] = React.useState([] as User[]);
  const user = useUser();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [targetDeleteUser, setTargetDeleteUser] = React.useState(null as User);

  React.useEffect(() => {
    ApiClient.getUsers().then(ret => {
      setUsers(ret);
      setIsLoaded(true);
    });
  }, []);

  return (
    <>
      {targetDeleteUser && (
        <ConfirmModal
          desc={`Are you sure to delete "${targetDeleteUser.username}"?`}
          onClose={() => {
            setTargetDeleteUser(null);
          }}
          onConfirm={() => {
            ApiClient.deleteUser(targetDeleteUser.id).then(() => {
              setUsers(users.filter(x => x.id !== targetDeleteUser.id));
              setTargetDeleteUser(null);
            });
          }}
        />
      )}

      <Dashboard>
        <div className="users-page">
          <Link
            href="/users/new"
            data-test="add-user-btn"
            className="btn btn-primary"
          >
            + Add User
          </Link>
          {!isLoaded && <div>loading...</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, i) => {
                const suffix = '-' + (i + 1);
                return (
                  <tr key={item.id}>
                    <td>
                      <span data-test={'username' + suffix}>
                        {item.username}
                      </span>
                    </td>
                    <td>
                      <span data-test={'role' + suffix}>{item.role}</span>
                    </td>
                    <td>
                      {user.id !== item.id && (
                        <>
                          <a
                            href="#"
                            data-test={'delete-btn' + suffix}
                            data-test-dir="left"
                            onClick={() => {
                              setTargetDeleteUser(item);
                            }}
                          >
                            Delete
                          </a>{' '}
                          |{' '}
                        </>
                      )}
                      <Link
                        href={`/users/${item.id}`}
                        data-test={'edit-btn' + suffix}
                      >
                        Edit
                      </Link>
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
