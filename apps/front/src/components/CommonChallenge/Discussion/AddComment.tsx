import * as React from 'react';
import styled from 'styled-components';
import { useUser } from 'src/hooks/useUser';
import { Avatar } from 'src/components/Avatar';
import { Title } from 'src/components/Title';
import { Theme, Button } from 'ui';
import { VoidLink } from 'src/components/VoidLink';
import { Input } from 'src/components/Input';
import mdParse from 'src/common/md';
import { Alert } from 'src/components/Alert';
import { getErrorMessage } from 'src/common/helper';
import { api } from 'src/services/api';
import { useActions } from 'typeless';
import { DiscussionActions, getDiscussionState } from './DiscussionTab';
import { GlobalActions } from 'src/features/global/interface';

interface AddCommentProps {
  className?: string;
  parentCommentId?: string;
  onCancel?: () => void;
  showBanner?: boolean;
  onCommentCreated?: () => void;
}

const Top = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  ${Title} {
    margin-left: 20px;
  }
`;

const CommentWrapper = styled.div`
  textarea {
    min-height: 100px;
    min-width: 100%;
    max-width: 100%;
    background: ${Theme.bgLightGray7};
  }
`;

const Bottom = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  ${VoidLink} {
    margin-right: 20px;
  }
  ${Button} {
    margin-left: 10px;
  }
`;

const Preview = styled.div`
  border-radius: 5px;
  padding: 10px;
  color: #3c485a;
  border: 1px solid #d4d6db;
  background: ${Theme.bgLightGray7};
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Bold = styled.strong`
  font-weight: bold;
`;

const _AddComment = (props: AddCommentProps) => {
  const {
    className,
    parentCommentId,
    onCancel,
    showBanner,
    onCommentCreated,
  } = props;
  const user = useUser();
  const [text, setText] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const { commentCreated } = useActions(DiscussionActions);
  const { showVerifyEmailError } = useActions(GlobalActions);

  const mdText = React.useMemo(() => {
    if (!isPreview) {
      return '';
    }
    return mdParse(text);
  }, [isPreview, text]);
  return (
    <div className={className}>
      {showBanner && (
        <Top>
          <Avatar avatarUrl={user.avatarUrl} />
          <Title>Add a new comment</Title>
        </Top>
      )}
      <CommentWrapper>
        {isPreview && (
          <Preview dangerouslySetInnerHTML={{ __html: mdText }}></Preview>
        )}
        <Input
          style={{ display: isPreview ? 'none' : 'block' }}
          id="new-comment"
          testId="new-comment-input"
          multiline
          value={text}
          onChange={e => setText(e.target.value || '')}
        />
      </CommentWrapper>
      {error && (
        <Alert testId="add-comment-error" type="error">
          {error}
        </Alert>
      )}
      <Bottom>
        <span>
          <Bold>Markdown</Bold> is supported
        </span>
        <Buttons>
          <LinkWrapper>
            <VoidLink onClick={() => setIsPreview(!isPreview)}>
              {isPreview ? 'Edit' : 'Preview'}
            </VoidLink>
          </LinkWrapper>
          <Button
            testId="post-comment-btn"
            onClick={async () => {
              if (!user.isVerified) {
                showVerifyEmailError();
                return;
              }
              setIsSubmitting(true);
              setError('');
              try {
                const comment = await api
                  .discussion_createComment({
                    ...getDiscussionState().target,
                    text: text,
                    parentCommentId,
                  })
                  .toPromise();
                commentCreated(comment);
                setText('');
                setIsPreview(false);
                if (onCommentCreated) {
                  onCommentCreated();
                }
              } catch (e) {
                setError(getErrorMessage(e));
              }
              setIsSubmitting(false);
            }}
            disabled={!text || !text.trim().length}
            type="primary"
            loading={isSubmitting}
          >
            POST COMMENT
          </Button>
          {onCancel && (
            <Button
              testId="cancel-comment-btn"
              onClick={onCancel}
              type="secondary"
            >
              CANCEL
            </Button>
          )}
        </Buttons>
      </Bottom>
    </div>
  );
};

export const AddComment = styled(_AddComment)`
  display: block;
`;
