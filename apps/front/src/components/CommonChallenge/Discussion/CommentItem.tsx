import * as React from 'react';
import styled, { css } from 'styled-components';
import { DiscussionComment, User } from 'shared';
import * as DateFns from 'date-fns';
import { Avatar } from 'src/components/Avatar';
import { Link } from 'src/components/Link';
import { createUrl } from 'src/common/url';
import { Theme, MOBILE } from 'ui';
import { VoidLink } from 'src/components/VoidLink';
import { AddComment } from './AddComment';
import { MenuDropdown } from 'src/components/MenuDropdown';
import {
  Dropdown,
  MenuItem,
  MenuSeparator,
} from 'src/components/DropdownPopup';
import { DotsIcon } from 'src/icons/DotsIcon';
import { useActions } from 'typeless';
import { DiscussionActions } from './DiscussionTab';

interface CommentItemProps {
  className?: string;
  comment: DiscussionComment;
  isNested?: boolean;
  user: User | null;
}

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Ago = styled.span`
  color: ${Theme.textLight};
  ${MOBILE} {
    display: none;
  }
`;

const Text = styled.div`
  & > p {
    margin: 0;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const MenuButton = styled(VoidLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: -10px;
  margin-left: 5px;
  &:hover {
    svg {
      path {
        fill: black;
      }
    }
  }
`;

const AnsweredTag = styled.div`
  color: ${Theme.green2};
  margin-left: 10px;
  background: ${Theme.lightGreen};
  padding: 3px 10px;
  border-radius: 3px;
`;

const Inner = styled.div`
  padding: 0 0 0 60px;
  position: relative;
  > ${Avatar} {
    position: absolute;
    left: 0px;
    top: 0px;
  }
`;

interface CommentMenuProps {
  comment: DiscussionComment;
  user: User | null;
}
function CommentMenu(props: CommentMenuProps) {
  const { comment, user } = props;
  const { deleteComment, markAsAnswer } = useActions(DiscussionActions);
  if (!user) {
    return null;
  }
  if (!user.isAdmin && user.id !== comment.user.id) {
    return null;
  }
  return (
    <MenuDropdown
      testId="comment-menu-btn"
      dropdown={
        <Dropdown data-test="comment-menu" style={{ minWidth: 100 }}>
          {user?.isAdmin && comment.parentCommentId && (
            <>
              <MenuItem>
                <VoidLink
                  data-test="set-answer-btn"
                  onClick={() => {
                    markAsAnswer(comment);
                  }}
                >
                  Set as answer
                </VoidLink>
              </MenuItem>
              <MenuSeparator />
            </>
          )}
          <MenuItem red>
            <VoidLink
              data-test="delete-btn"
              onClick={() => {
                deleteComment(comment);
              }}
            >
              Remove
            </VoidLink>
          </MenuItem>
        </Dropdown>
      }
    >
      <MenuButton>
        <DotsIcon />
      </MenuButton>
    </MenuDropdown>
  );
}

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubComments = styled.div`
  margin: 20px;
  ${MOBILE} {
    margin: 10px;
  }
`;

const _CommentItem = (props: CommentItemProps) => {
  const { className, comment, isNested, user } = props;
  const [isReplyVisible, setIsReplyVisible] = React.useState(false);

  const ago = React.useMemo(() => {
    return DateFns.formatDistanceToNow(new Date(comment.createdAt), {
      addSuffix: true,
    });
  }, [comment.createdAt]);

  return (
    <div
      className={className}
      id={`comment-${comment.id}`}
      data-test={`comment-${comment.id}`}
    >
      <Inner>
        <Avatar avatarUrl={comment.user.avatarUrl} />
        <Top>
          <Link
            href={createUrl({
              name: 'profile',
              username: comment.user.username,
            })}
          >
            {comment.user.username}
          </Link>
          <Toolbar>
            <Ago>{ago}</Ago>
            {comment.isAnswered && (
              <AnsweredTag data-test="answered-tag">Answered</AnsweredTag>
            )}
            <CommentMenu comment={comment} user={user} />
          </Toolbar>
        </Top>
        <Text
          data-test="text"
          dangerouslySetInnerHTML={{
            __html: comment.isDeleted ? '[Deleted]' : comment.html,
          }}
        ></Text>
      </Inner>
      <SubComments>
        {comment.children.map(item => (
          <CommentItem comment={item} user={user} key={item.id} isNested />
        ))}
      </SubComments>
      {!isNested && user && (
        <Bottom>
          <VoidLink
            data-test="reply-btn"
            onClick={() => setIsReplyVisible(true)}
          >
            Reply
          </VoidLink>
        </Bottom>
      )}
      {isReplyVisible && (
        <AddComment
          parentCommentId={comment.id}
          onCancel={() => setIsReplyVisible(false)}
          onCommentCreated={() => {
            setIsReplyVisible(false);
          }}
        />
      )}
    </div>
  );
};

export const CommentItem = styled(_CommentItem)`
  border-radius: 5px;
  border: 1px solid ${Theme.grayLight};
  margin-bottom: 20px;
  padding: 20px;
  ${props =>
    props.isNested &&
    css`
      border: none;
      padding: 20px;
      background: ${props.comment.isAnswer
        ? Theme.lightGreen
        : Theme.bgLightGray11};
      border-radius: 5px;
      margin-bottom: 10px;
    `}
`;
