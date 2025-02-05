// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Icon,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  merge,
  mergeStyles,
  PersonaPresence,
  Stack,
  Theme
} from '@fluentui/react';
/* @conditional-compile-remove(total-participant-count) */
import { Text } from '@fluentui/react';
/* @conditional-compile-remove(raise-hand) */
import { useTheme } from '../theming';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandIcon } from './assets/RaisedHandIcon';
import React, { useCallback, useMemo } from 'react';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';
import {
  BaseCustomStyles,
  CallParticipantListParticipant,
  OnRenderAvatarCallback,
  ParticipantListParticipant
} from '../types';
import { ParticipantItem, ParticipantItemStrings, ParticipantItemStyles } from './ParticipantItem';
import { iconStyles, participantListItemStyle, participantListStyle } from './styles/ParticipantList.styles';
import { _formatString } from '@internal/acs-ui-common';

/**
 * Styles for the {@link ParticipantList} {@link ParticipantItem}.
 *
 * @public
 */
export interface ParticipantListItemStyles extends ParticipantItemStyles {
  /** Styles applied to the sub-menu of the {@link ParticipantList} {@link ParticipantItem}. */
  participantSubMenuItemsStyles?: IContextualMenuItemStyles;
}

/**
 * Styles for the {@link ParticipantList}.
 *
 * @public
 */
export interface ParticipantListStyles extends BaseCustomStyles {
  /** Styles for the {@link ParticipantList} {@link ParticipantItem}. */
  participantItemStyles?: ParticipantListItemStyles;
}

/* @conditional-compile-remove(total-participant-count) */
/**
 * Strings for the {@link ParticipantList}.
 *
 * @beta
 */
export interface ParticipantListStrings {
  /**
   * String for rendering the count of participants not contained in the displayed participant list
   */
  overflowParticipantCount?: string;
}

/**
 * A callback for providing custom menu items for each participant in {@link ParticipantList}.
 *
 * @public
 */
export type ParticipantMenuItemsCallback = (
  participantUserId: string,
  userId?: string,
  defaultMenuItems?: IContextualMenuItem[]
) => IContextualMenuItem[];

/**
 * Props for {@link ParticipantList}.
 *
 * @public
 */
export type ParticipantListProps = {
  /** Participants in user call or chat */
  participants: ParticipantListParticipant[];
  /** User ID of user */
  myUserId?: string;
  /**
   * If set to `true`, excludes the local participant from the participant list with use of `myUserId` props (required in this case).
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: ParticipantListParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: OnRenderAvatarCallback;
  /** Optional callback to render the context menu for each participant  */
  onRemoveParticipant?: (userId: string) => void;
  /** Optional callback to render custom menu items for each participant. */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /** Optional callback when rendered ParticipantItem is clicked */
  onParticipantClick?: (participant?: ParticipantListParticipant) => void;
  /** Styles for the {@link ParticipantList} */
  styles?: ParticipantListStyles;
  /** Optional value to determine if the tooltip should be shown for participants or not */
  showParticipantOverflowTooltip?: boolean;
  /* @conditional-compile-remove(total-participant-count) */
  /** Total number of people in the call. This number can be larger than the remote participant count. */
  totalParticipantCount?: number;
  /* @conditional-compile-remove(total-participant-count) */
  /** Strings for the participant list */
  strings?: ParticipantListStrings;
  /** Optional aria-lablledby prop that prefixes each ParticipantItem aria-label */
  participantAriaLabelledBy?: string;
};

const onRenderParticipantDefault = (
  participant: ParticipantListParticipant,
  strings: ParticipantItemStrings,
  myUserId?: string,
  onRenderAvatar?: OnRenderAvatarCallback,
  createParticipantMenuItems?: (participant: ParticipantListParticipant) => IContextualMenuItem[],
  styles?: ParticipantListItemStyles,
  onParticipantClick?: (participant?: ParticipantListParticipant) => void,
  showParticipantOverflowTooltip?: boolean,
  participantAriaLabelledBy?: string,
  theme?: Theme
): JSX.Element | null => {
  const callingParticipant = participant as CallParticipantListParticipant;

  let presence: PersonaPresence | undefined = undefined;
  if (callingParticipant) {
    if (callingParticipant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (callingParticipant.state === 'Idle') {
      presence = PersonaPresence.away;
    }
  }

  const menuItems = createParticipantMenuItems && createParticipantMenuItems(participant);

  const onRenderIcon =
    callingParticipant?.isScreenSharing ||
    callingParticipant?.isMuted ||
    /* @conditional-compile-remove(raise-hand) */ callingParticipant?.raisedHand
      ? () => (
          <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
            {
              /* @conditional-compile-remove(raise-hand) */ callingParticipant.raisedHand && (
                <Stack
                  horizontal={true}
                  tokens={{ childrenGap: '0.2rem' }}
                  style={{
                    alignItems: 'center',
                    padding: '0.1rem 0.2rem',
                    backgroundColor: theme?.palette.neutralLighter,
                    borderRadius: '0.3rem'
                  }}
                >
                  {callingParticipant.raisedHand.raisedHandOrderPosition && (
                    <Stack.Item>
                      <Text>{callingParticipant.raisedHand?.raisedHandOrderPosition}</Text>
                    </Stack.Item>
                  )}
                  <Stack.Item>
                    <RaisedHandIcon />
                  </Stack.Item>
                </Stack>
              )
            }
            {callingParticipant.isScreenSharing && (
              <Icon
                iconName="ParticipantItemScreenShareStart"
                className={iconStyles}
                ariaLabel={strings.sharingIconLabel}
              />
            )}
            {callingParticipant.isMuted && (
              <Icon iconName="ParticipantItemMicOff" className={iconStyles} ariaLabel={strings.mutedIconLabel} />
            )}
          </Stack>
        )
      : () => null;

  return (
    <ParticipantItem
      styles={styles}
      key={participant.userId}
      userId={participant.userId}
      displayName={participant.displayName}
      me={myUserId ? participant.userId === myUserId : false}
      menuItems={menuItems}
      presence={presence}
      onRenderIcon={onRenderIcon}
      onRenderAvatar={onRenderAvatar}
      onClick={() => onParticipantClick?.(participant)}
      showParticipantOverflowTooltip={showParticipantOverflowTooltip}
      /* @conditional-compile-remove(one-to-n-calling) */
      /* @conditional-compile-remove(PSTN-calls) */
      participantState={callingParticipant.state}
      ariaLabelledBy={participantAriaLabelledBy}
    />
  );
};

/**
 * Sort participants by raised hand order position
 */
const sortParticipants = (participants: ParticipantListParticipant[]): ParticipantListParticipant[] => {
  /* @conditional-compile-remove(raise-hand) */
  const isParticipantListCallParticipant = function (participant: ParticipantListParticipant): boolean {
    return 'raisedHand' in participant;
  };

  /* @conditional-compile-remove(raise-hand) */
  participants.sort((a, b) => {
    if (!isParticipantListCallParticipant(a) || !isParticipantListCallParticipant(b)) {
      return 0;
    }
    const callA = a as CallParticipantListParticipant;
    const callB = b as CallParticipantListParticipant;
    if (callA.raisedHand && callB.raisedHand) {
      return callA.raisedHand.raisedHandOrderPosition - callB.raisedHand.raisedHandOrderPosition;
    } else if (callA.raisedHand) {
      return -1;
    } else if (callB.raisedHand) {
      return 1;
    }
    return 0;
  });
  return participants;
};

const getParticipantsForDefaultRender = (
  participants: ParticipantListParticipant[],
  excludeMe: boolean,
  myUserId: string | undefined
): ParticipantListParticipant[] => {
  if (!excludeMe || !myUserId) {
    return [...participants];
  }

  const userIndex = participants.map((p) => p.userId).indexOf(myUserId);

  if (userIndex === -1) {
    return [...participants];
  }

  const remoteParticipants = [...participants];
  remoteParticipants.splice(userIndex, 1);

  return remoteParticipants;
};

/**
 * Component to render all calling or chat participants.
 *
 * By default, each participant is rendered with {@link ParticipantItem}. See {@link ParticipantListProps.onRenderParticipant} to override.
 *
 * @public
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const {
    excludeMe = false,
    myUserId,
    participants,
    onRemoveParticipant,
    onRenderAvatar,
    onRenderParticipant,
    onFetchParticipantMenuItems,
    showParticipantOverflowTooltip,
    /* @conditional-compile-remove(total-participant-count) */
    totalParticipantCount,
    /* @conditional-compile-remove(total-participant-count) */
    strings,
    participantAriaLabelledBy
  } = props;

  /* @conditional-compile-remove(raise-hand) */
  const theme = useTheme();
  const ids = useIdentifiers();
  const participantItemStrings = useLocale().strings.participantItem;
  /* @conditional-compile-remove(total-participant-count) */
  const participantListStrings = useLocale().strings.ParticipantList;

  const displayedParticipants: ParticipantListParticipant[] = useMemo(() => {
    return onRenderParticipant ? participants : getParticipantsForDefaultRender(participants, excludeMe, myUserId);
  }, [participants, excludeMe, myUserId, onRenderParticipant]);

  sortParticipants(displayedParticipants);

  const createParticipantMenuItems = useCallback(
    (participant: ParticipantListParticipant): IContextualMenuItem[] => {
      let menuItems: IContextualMenuItem[] = [];

      const participantIsRemovable = participant.isRemovable;
      if (participant.userId !== myUserId && onRemoveParticipant && participantIsRemovable) {
        menuItems.push({
          key: 'remove',
          text: participantItemStrings.removeButtonLabel,
          onClick: () => onRemoveParticipant(participant.userId),
          itemProps: {
            styles: props.styles?.participantItemStyles?.participantSubMenuItemsStyles
          },
          'data-ui-id': ids.participantListRemoveParticipantButton
        });
      }

      if (onFetchParticipantMenuItems) {
        menuItems = onFetchParticipantMenuItems(participant.userId, myUserId, menuItems);
      }

      return menuItems;
    },
    [
      ids.participantListRemoveParticipantButton,
      myUserId,
      onFetchParticipantMenuItems,
      onRemoveParticipant,
      props.styles?.participantItemStyles?.participantSubMenuItemsStyles,
      /* @conditional-compile-remove(raise-hand) */
      participantItemStrings.removeButtonLabel
    ]
  );

  const participantItemStyles = useMemo(
    () => merge(participantListItemStyle, props.styles?.participantItemStyles),
    [props.styles?.participantItemStyles]
  );

  /* @conditional-compile-remove(total-participant-count) */
  const overflowParticipantCountString =
    strings?.overflowParticipantCount ?? participantListStrings?.overflowParticipantCount;

  return (
    <Stack
      data-ui-id={ids.participantList}
      className={mergeStyles(participantListStyle, props.styles?.root)}
      role={'menu'}
    >
      {displayedParticipants.map((participant: ParticipantListParticipant) =>
        onRenderParticipant
          ? onRenderParticipant(participant)
          : onRenderParticipantDefault(
              participant,
              participantItemStrings,
              myUserId,
              onRenderAvatar,
              createParticipantMenuItems,
              participantItemStyles,
              props.onParticipantClick,
              showParticipantOverflowTooltip,
              participantAriaLabelledBy,
              /* @conditional-compile-remove(raise-hand) */
              theme
            )
      )}
      {
        /* @conditional-compile-remove(total-participant-count) */ overflowParticipantCountString &&
          totalParticipantCount &&
          totalParticipantCount > displayedParticipants.length && (
            <Text style={{ fontWeight: 400, margin: '0.5rem' }}>
              {_formatString(overflowParticipantCountString, {
                overflowCount: `${totalParticipantCount - displayedParticipants.length}`
              })}
            </Text>
          )
      }
    </Stack>
  );
};
