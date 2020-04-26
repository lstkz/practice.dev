import * as React from 'react';
import styled from 'styled-components';
import { getPublicProfileState } from '../interface';
import { Theme } from 'ui';
import { LinkIcon } from 'src/icons/LinkIcon';
import { countryList } from 'shared';

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
  color: ${Theme.textDark};
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

// const FollowButton = styled(Button)`
//   margin-top: 20px;
// `;

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
  const country = React.useMemo(() => {
    if (!profile.country) {
      return null;
    }
    return countryList.find(x => x.code === profile.country);
  }, [profile]);
  return (
    <div className={className} data-test="profile-info">
      <Avatar />
      <Name data-test="name">{profile.name || profile.username}</Name>
      {country && (
        <Country data-test="country">
          {country.emoji} {country.name}
        </Country>
      )}
      {profile.bio && <Bio data-test="bio">“{profile.bio}“</Bio>}
      {/* <FollowButton block type="primary">
        + FOLLOW
      </FollowButton> */}
      {profile.url && (
        <ExternalLink data-test="url" href={profile.url} target="_blank">
          <LinkIcon />
          {profile.url}
        </ExternalLink>
      )}
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
