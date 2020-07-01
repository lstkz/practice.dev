import { User } from '../../types';
import { useForm } from 'react-hook-form';
import React from 'react';

interface AddMemberFormProps {
  users: User[];
  onAdd(user: User): void;
}

interface FormValues {
  member: string;
}

export function AddMemberForm(props: AddMemberFormProps) {
  const { users, onAdd } = props;
  const { handleSubmit, register, errors, setValue } = useForm<FormValues>({
    defaultValues: {
      member: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    onAdd(users.find(x => x.id === Number(values.member)));
    setValue('member', '');
  };

  return (
    <div className="add-select-wrapper">
      <div className="select" data-test="add-member">
        <select
          id="member"
          name="member"
          ref={register({
            required: 'Member is required',
          })}
        >
          <option disabled value="">
            select
          </option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {errors.member && (
          <div data-test="error" className="error">
            {errors.member.message}
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit(onSubmit)}
        className="btn btn-primary"
        data-test="add-member-btn"
      >
        Add
      </button>
    </div>
  );
}
