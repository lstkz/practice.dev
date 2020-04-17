import * as React from 'react';
import styled from 'styled-components';
import { getPublicProfileState } from '../interface';
import { Theme, Button } from 'ui';
import { LinkIcon } from 'src/icons/LinkIcon';

interface ProfileInfoProps {
  className?: string;
}

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #ccc;
`;

const Name = styled.div`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin-top: 20px;
`;
const Country = styled.div`
  margin-top: 12px;
  line-height: 17px;
`;

const Bio = styled.div`
  margin-top: 25px;
  padding: 15px 20px;
  background: ${Theme.bgLightGray9};
  border-radius: 5px;
`;

const FollowButton = styled(Button)`
  margin-top: 20px;
`;

const ExternalLink = styled.a`
  margin-top: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

const _ProfileInfo = (props: ProfileInfoProps) => {
  const { className } = props;
  const { profile } = getPublicProfileState.useState();
  return (
    <div className={className}>
      <Avatar />
      <Name>{profile.username}</Name>
      <Country>🇵🇱Poland</Country>
      <Bio>“Hi, I am a full stack developer!“</Bio>
      <FollowButton block type="primary">
        + FOLLOW
      </FollowButton>
      <ExternalLink>
        <LinkIcon />
        https://twitter.com/MyAccount
      </ExternalLink>
    </div>
  );
};

export const ProfileInfo = styled(_ProfileInfo)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white;
  height: 100%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;
