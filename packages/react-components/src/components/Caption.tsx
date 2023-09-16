// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IPersona, Persona, Stack, PersonaSize, Text, IStackStyles } from '@fluentui/react';
import React from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { OnRenderAvatarCallback } from '../types';
import {
  captionClassName,
  captionsContentContainerClassName,
  displayNameClassName,
  displayNameContainerClassName,
  iconClassName
} from './styles/Captions.style';
import { _CaptionsInfo } from './CaptionsBanner';

/**
 * @internal
 * Props for a single line of caption.
 */
export interface _CaptionProps extends _CaptionsInfo {
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * @internal
 * A component for displaying a single line of caption
 */
export const _Caption = (props: _CaptionProps): JSX.Element => {
  const { displayName, userId, captionText, sentimentAnalysis, onRenderAvatar } = props;

  const personaOptions: IPersona = {
    hidePersonaDetails: true,
    size: PersonaSize.size32,
    text: displayName,
    showOverflowTooltip: false,
    initialsTextColor: 'white',
    styles: {
      root: {
        margin: '0.25rem'
      }
    }
  };

  const sentimentColor =
    sentimentAnalysis?.sentiment.toLowerCase() === 'positive'
      ? '#00ff1b63'
      : sentimentAnalysis?.sentiment.toLowerCase() === 'negative'
      ? '#ff2000a3'
      : '';

  const userIcon = onRenderAvatar ? onRenderAvatar(userId ?? '', personaOptions) : <Persona {...personaOptions} />;

  const captionStackStyles: IStackStyles = {
    root: {
      backgroundColor: `${sentimentColor}`
    }
  };

  return (
    <Stack horizontal verticalAlign="start" horizontalAlign="start" styles={captionStackStyles}>
      <Stack.Item className={iconClassName}>{userIcon}</Stack.Item>

      <Stack verticalAlign="start" className={captionsContentContainerClassName}>
        <Stack.Item className={displayNameContainerClassName}>
          <Text className={displayNameClassName}>{displayName}</Text>
        </Stack.Item>
        <Stack.Item className={captionClassName} dir="auto">
          {captionText}
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
