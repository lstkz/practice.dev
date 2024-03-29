import { SettingsSection } from './SettingsSection';
import * as Rx from 'src/rx';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { getSettingsState } from '../interface';
import { createModule, useActions } from 'typeless';
import { PictureSectionSymbol } from '../symbol';
import { CropModal } from './CropModal';
import { api } from 'src/services/api';
import { getAvatarUrl } from 'src/common/helper';
import { GlobalActions } from 'src/features/global/interface';
import { ConfirmModalActions } from 'src/features/confirmModal/interface';
import { DeleteType } from 'src/types';
import { Theme, MOBILE } from 'src/Theme';
import { Button } from 'src/components/Button';

export const [
  handle,
  PictureSectionActions,
  getPictureSectionState,
] = createModule(PictureSectionSymbol)
  .withActions({
    showCrop: (image: any) => ({ payload: { image } }),
    hideCrop: null,
    updateImage: (blob: Blob) => ({
      payload: { blob },
    }),
    setIsUpdating: (isUpdating: boolean) => ({ payload: { isUpdating } }),
    setUploadError: (uploadError: string) => ({ payload: { uploadError } }),
    deleteAvatar: null,
  })
  .withState<PictureSectionState>();

interface PictureSectionState {
  isCropOpen: boolean;
  cropImage: any;
  isUpdating: boolean;
  uploadError: string | null;
}

handle
  .epic()
  .on(PictureSectionActions.updateImage, ({ blob }) => {
    return Rx.concatObs(
      Rx.of(PictureSectionActions.setIsUpdating(true)),
      Rx.defer(() => {}),
      api.user_getAvatarUploadUrl().pipe(
        Rx.mergeMap(params => {
          const formData = new FormData();
          Object.keys(params.fields).forEach(key => {
            formData.append(key, params.fields[key]);
          });
          formData.append('file', blob);
          return Rx.ajax({
            url: params.url,
            method: 'POST',
            body: formData,
          });
        }),
        Rx.mergeMap(() => api.user_completeAvatarUpload()),
        Rx.mergeMap(ret => [
          PictureSectionActions.hideCrop(),
          GlobalActions.avatarUpdated(ret.avatarUrl),
        ]),
        Rx.catchLog(() => {
          return Rx.of(
            PictureSectionActions.setUploadError(
              'An error occurred. Please try again later.'
            )
          );
        })
      ),
      Rx.of(PictureSectionActions.setIsUpdating(false))
    );
  })
  .on(PictureSectionActions.deleteAvatar, (_, { action$ }) =>
    Rx.concatObs(
      Rx.of(
        ConfirmModalActions.show(
          'Confirm',
          'Are you sure to delete profile picture?',
          [
            { text: 'Delete', type: 'danger', value: 'delete' as DeleteType },
            { text: 'Cancel', type: 'secondary', value: 'close' as DeleteType },
          ]
        )
      ),
      action$.pipe(
        Rx.waitForType(ConfirmModalActions.onResult),
        Rx.mergeMap(({ payload }) => {
          const result = payload.result as DeleteType;
          if (result !== 'delete') {
            return Rx.of(ConfirmModalActions.close());
          }
          return Rx.concatObs(
            Rx.of(ConfirmModalActions.close()),
            Rx.of(GlobalActions.avatarUpdated(null)),
            api.user_deleteAvatar().pipe(Rx.ignoreElements())
          );
        })
      )
    )
  );

const initialState: PictureSectionState = {
  isCropOpen: false,
  cropImage: null,
  isUpdating: false,
  uploadError: null,
};

handle
  .reducer(initialState)
  .on(PictureSectionActions.showCrop, (state, { image }) => {
    state.isCropOpen = true;
    state.cropImage = image;
  })
  .on(PictureSectionActions.hideCrop, state => {
    state.isCropOpen = false;
    state.cropImage = null;
  })
  .on(PictureSectionActions.setIsUpdating, (state, { isUpdating }) => {
    state.isUpdating = isUpdating;
  })
  .on(PictureSectionActions.updateImage, state => {
    state.uploadError = null;
  })
  .on(PictureSectionActions.setUploadError, (state, { uploadError }) => {
    state.uploadError = uploadError;
  });

const Wrapper = styled.div`
  display: flex;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  margin-right: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${Theme.gray4};
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  ${Button} + ${Button} {
    margin-left: 10px;
  }

  ${MOBILE} {
    flex-direction: column;
    ${Button} {
      width: 100%;
    }
    ${Button} + ${Button} {
      margin-left: 0;
      margin-top: 10px;
    }
  }
`;

export function PictureSection() {
  handle();
  const { profile } = getSettingsState.useState();
  const [fileKey, setFileKey] = React.useState(1);
  const inputRef = useRef<HTMLInputElement>(null!);
  const { showCrop, deleteAvatar } = useActions(PictureSectionActions);
  const avatarUrl = getAvatarUrl(profile.avatarUrl, 'lg');
  return (
    <SettingsSection title="Profile Picture">
      <CropModal />
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        key={fileKey}
        accept="image/png, image/jpeg"
        onChange={e => {
          if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              showCrop(reader.result);
              setFileKey(fileKey + 1);
            });
            reader.readAsDataURL(e.target.files[0]);
          }
        }}
      />
      <Wrapper>
        <Avatar data-test="avatar">
          {avatarUrl && <img src={avatarUrl} />}
        </Avatar>
        <Buttons>
          <Button
            testId="update-photo-btn"
            type="primary"
            onClick={() => inputRef.current.click()}
          >
            UPDATE PHOTO
          </Button>
          <Button
            testId="delete-photo-btn"
            type="danger"
            onClick={deleteAvatar}
            disabled={!profile.avatarUrl}
          >
            DELETE
          </Button>
        </Buttons>
      </Wrapper>
    </SettingsSection>
  );
}
