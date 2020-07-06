import * as React from 'react';
import '../styles.css';

interface InputTestCase {
  id: number;
  isLikedByMe: boolean;
  likedFriends: string[];
  totalLikes: number;
}

function formatLike(input: InputTestCase) {
  if (input.totalLikes === 0) {
    return '0 Likes';
  }
  if (input.likedFriends.length === 1 && input.totalLikes === 1) {
    return `${input.likedFriends[0]} likes it`;
  }
  if (!input.isLikedByMe && input.likedFriends.length === 0) {
    if (input.totalLikes === 1) {
      return '1 person likes it';
    }
    return `${input.totalLikes} people like it`;
  }
  const parts: string[] = [];
  if (input.isLikedByMe) {
    parts.push('You');
  }
  if (input.likedFriends.length) {
    parts.push(...input.likedFriends);
  }
  const left =
    input.totalLikes - input.likedFriends.length - (input.isLikedByMe ? 1 : 0);
  if (left === 1) {
    parts.push('1 another person');
  } else if (left > 1) {
    parts.push(`${left} other people`);
  }
  if (parts.length > 2) {
    const comma = parts.slice(0, parts.length - 1);
    const last = parts[parts.length - 1];
    return `${comma.join(', ')} and ${last} like it`;
  } else {
    return `${parts.join(' and ')} like it`;
  }
}

const data: InputTestCase[] = [
  {
    id: 1,
    isLikedByMe: false,
    likedFriends: ['Merill', 'Meyer', 'Abbott'],
    totalLikes: 4,
  },
  {
    id: 2,
    isLikedByMe: false,
    likedFriends: ['Ross', 'Jerrie', 'Eamon'],
    totalLikes: 6,
  },
  {
    id: 3,
    isLikedByMe: false,
    likedFriends: ['Eamon', 'Ross', 'Jerrie'],
    totalLikes: 3,
  },
  {
    id: 4,
    isLikedByMe: true,
    likedFriends: ['Meyer'],
    totalLikes: 5,
  },
  {
    id: 5,
    isLikedByMe: true,
    likedFriends: ['Merill', 'Meyer', 'Otes'],
    totalLikes: 7,
  },
  {
    id: 6,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 4,
  },
  {
    id: 7,
    isLikedByMe: false,
    likedFriends: ['Eamon'],
    totalLikes: 2,
  },
  {
    id: 8,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 1,
  },
  {
    id: 9,
    isLikedByMe: true,
    likedFriends: ['Eamon'],
    totalLikes: 3,
  },
  {
    id: 10,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 3,
  },
  {
    id: 11,
    isLikedByMe: true,
    likedFriends: ['Meyer', 'Otes', 'Vera'],
    totalLikes: 5,
  },
  {
    id: 12,
    isLikedByMe: false,
    likedFriends: [],
    totalLikes: 0,
  },
  {
    id: 13,
    isLikedByMe: true,
    likedFriends: ['Abbott'],
    totalLikes: 2,
  },
  {
    id: 14,
    isLikedByMe: true,
    likedFriends: ['Nevsa', 'Tod', 'Abbott'],
    totalLikes: 4,
  },
  {
    id: 15,
    isLikedByMe: false,
    likedFriends: ['Meyer'],
    totalLikes: 1,
  },
  {
    id: 16,
    isLikedByMe: false,
    likedFriends: ['Vera'],
    totalLikes: 4,
  },
  {
    id: 17,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 2,
  },
  {
    id: 18,
    isLikedByMe: true,
    likedFriends: [],
    totalLikes: 1,
  },
];

export default function App() {
  const [result, setResult] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="main-content">
      <h1>Like Formatter</h1>
      <div className="form">
        <div className="textbox" data-test="input-id" data-test-dir="left">
          <input ref={inputRef} placeholder="Enter id..." type="text" />
        </div>
        <button
          data-test="format-btn"
          className="btn btn-primary btn-format"
          onClick={() => {
            const id = Number(inputRef.current!.value);
            const input = data.find(x => x.id === id)!;
            setResult(formatLike(input));
          }}
        >
          Format
        </button>
      </div>
      <div className="result" data-test="result">
        {result}
      </div>
    </div>
  );
}
