import * as React from 'react';
import styled, { css } from 'styled-components';
import { DiscussionComment } from 'shared';
import * as DateFns from 'date-fns';
import { Avatar } from 'src/components/Avatar';
import { Link } from 'src/components/Link';
import { createUrl } from 'src/common/url';
import { Theme } from 'ui';
import mdParse from 'src/common/md';
import { VoidLink } from 'src/components/VoidLink';
import { AddComment } from './AddComment';
import { MenuDropdown } from 'src/components/MenuDropdown';
import {
  Dropdown,
  MenuItem,
  MenuSeparator,
} from 'src/components/DropdownPopup';
import { DotsIcon } from 'src/icons/DotsIcon';

interface CommentItemProps {
  className?: string;
  comment: DiscussionComment;
  isNested?: boolean;
}

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Ago = styled.span`
  color: ${Theme.textLight};
`;

const Text = styled.div``;

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

const Inner = styled.div`
  padding: 0 0 0 60px;
  position: relative;
  > ${Avatar} {
    position: absolute;
    left: 0px;
    top: 0px;
  }
`;

function CommentMenu() {
  return (
    <MenuDropdown
      testId="solution-menu-btn"
      dropdown={
        <Dropdown data-test="comment-menu" style={{ minWidth: 100 }}>
          <MenuItem>
            <VoidLink
              data-test="set-answer-btn"
              onClick={() => {
                //
              }}
            >
              Set as answer
            </VoidLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem red>
            <VoidLink
              data-test="delete-btn"
              onClick={() => {
                //
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
`;

const _CommentItem = (props: CommentItemProps) => {
  const { className, comment, isNested } = props;
  const [isReplyVisible, setIsReplyVisible] = React.useState(false);

  const ago = React.useMemo(() => {
    return DateFns.formatDistanceToNow(new Date(comment.createdAt), {
      addSuffix: true,
    });
  }, [comment.createdAt]);

  const mdText = React.useMemo(() => {
    return mdParse(comment.text);
  }, [comment.text]);

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
            <CommentMenu />
          </Toolbar>
        </Top>
        <Text dangerouslySetInnerHTML={{ __html: mdText }}></Text>
      </Inner>
      <SubComments>
        {comment.children.map(item => (
          <CommentItem comment={item} key={item.id} isNested />
        ))}
      </SubComments>
      {!isNested && (
        <Bottom>
          <VoidLink onClick={() => setIsReplyVisible(true)}>Reply</VoidLink>
        </Bottom>
      )}
      {isReplyVisible && (
        <AddComment
          parentCommentId={comment.id}
          onCancel={() => setIsReplyVisible(false)}
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
      background: ${Theme.bgLightGray11};
      border-radius: 5px;
      margin-bottom: 10px;
      ${Inner} {
      }
    `}
`;
