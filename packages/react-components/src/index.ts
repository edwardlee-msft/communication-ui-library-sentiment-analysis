// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './components';
export { _IdentifierProvider } from './identifiers';
export type { _Identifiers, _IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';

export type {
  BaseCustomStyles,
  CallParticipantListParticipant,
  ChatMessage,
  CommunicationParticipant,
  ComponentSlotStyle,
  ContentSystemMessage,
  CreateVideoStreamViewResult,
  CustomAvatarOptions,
  CustomMessage,
  Message,
  MessageAttachedStatus,
  MessageCommon,
  MessageContentType,
  OnRenderAvatarCallback,
  ParticipantAddedSystemMessage,
  ParticipantListParticipant,
  ParticipantRemovedSystemMessage,
  ParticipantState,
  ReadReceiptsBySenderId,
  SystemMessage,
  SystemMessageCommon,
  TopicUpdatedSystemMessage,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryStream,
  VideoStreamOptions,
  ViewScalingMode
} from './types';

/* @conditional-compile-remove(raise-hand) */
export type { RaisedHand } from './types';

/* @conditional-compile-remove(close-captions) */
export type { SpokenLanguageStrings, CaptionLanguageStrings } from './types';
/* @conditional-compile-remove(close-captions) */
export { _spokenLanguageToCaptionLanguage } from './types';

/* @conditional-compile-remove(data-loss-prevention) */
export type { BlockedMessage } from './types';
