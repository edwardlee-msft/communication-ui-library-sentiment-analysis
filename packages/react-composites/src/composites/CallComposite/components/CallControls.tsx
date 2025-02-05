// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFunction, Stack, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
import { IContextualMenuItem } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
import { useState } from 'react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, ParticipantMenuItemsCallback } from '@internal/react-components';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { generateCustomControlBarButtons, onFetchCustomButtonPropsTrampoline } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { People } from './buttons/People';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
import { MoreButton } from '../../common/MoreButton';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { usePropsFor } from '../hooks/usePropsFor';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { SendDtmfDialpad } from '../../common/SendDtmfDialpad';
/* @conditional-compile-remove(PSTN-calls) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isDisabled } from '../utils';
import { callControlsContainerStyles } from '../styles/CallPage.styles';
import { CommonCallAdapter } from '../adapter';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHand } from './buttons/RaiseHand';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
/**
 * @private
 */
export type CallControlsProps = {
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  peopleButtonChecked?: boolean;
  onPeopleButtonClicked?: () => void;
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
  /**
   * Option to increase the height of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemSize?: boolean;
  isMobile?: boolean;
  displayVertical?: boolean;
};

// Enforce a background color on control bar to ensure it matches the composite background color.
const controlBarStyles = memoizeFunction((background: string) => ({ root: { background: background } }));

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options = useMemo(() => (typeof props.options === 'boolean' ? {} : props.options), [props.options]);
  /* @conditional-compile-remove(PSTN-calls) */
  const adapter = useAdapter();

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const localeStrings = useLocale();

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const peopleButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.peopleButtonLabel,
      tooltipOffContent: localeStrings.strings.call.peopleButtonTooltipOpen,
      tooltipOnContent: localeStrings.strings.call.peopleButtonTooltipClose
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const moreButtonStrings = useMemo(
    () => ({
      label: localeStrings.strings.call.moreButtonCallingLabel,
      tooltipOffContent: localeStrings.strings.callWithChat.moreDrawerButtonTooltip
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: localeStrings.strings.call.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: localeStrings.strings.call.dialpadCloseModalButtonAriaLabel,
      placeholderText: localeStrings.strings.call.dtmfDialpadPlaceholderText
    }),
    [localeStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const holdButtonProps = usePropsFor(HoldButton);

  /* @conditional-compile-remove(raise-hand) */
  const raiseHandButtonProps = usePropsFor(RaiseHandButton) as RaiseHandButtonProps;

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = useAdapter().getState().alternateCallerId;

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  const moreButtonContextualMenuItems = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (props.isMobile && props.onPeopleButtonClicked && isEnabled(options?.participantsButton)) {
      items.push({
        key: 'peopleButtonKey',
        text: localeStrings.component.strings.participantsButton.label,
        onClick: () => {
          if (props.onPeopleButtonClicked) {
            props.onPeopleButtonClicked();
          }
        },
        iconProps: { iconName: 'ControlButtonParticipantsContextualMenuItem', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: isDisabled(options?.participantsButton),
        ['data-ui-id']: 'call-composite-more-menu-people-button'
      });
    }

    /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
    if (!isRoomsCallTrampoline(adapter)) {
      items.push({
        key: 'holdButtonKey',
        text: localeStrings.component.strings.holdButton.tooltipOffContent,
        onClick: () => {
          holdButtonProps.onToggleHold();
        },
        iconProps: { iconName: 'HoldCallContextualMenuItem', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: isDisabled(options?.holdButton),
        ['data-ui-id']: 'hold-button'
      });
    }

    /* @conditional-compile-remove(PSTN-calls) */
    // dtmf tone sending only works for 1:1 PSTN call
    if (alternateCallerId) {
      items.push({
        key: 'showDialpadKey',
        text: localeStrings.strings.call.openDtmfDialpadLabel,
        onClick: () => {
          setShowDialpad(true);
        },
        iconProps: { iconName: 'PeoplePaneOpenDialpad', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        }
      });
    }

    /* @conditional-compile-remove(raise-hand) */
    if (raiseHandButtonIsEnabled) {
      items.push({
        key: 'raiseHandButtonKey',
        text: raiseHandButtonProps.checked
          ? localeStrings.component.strings.raiseHandButton.onLabel
          : localeStrings.component.strings.raiseHandButton.offLabel,
        onClick: () => {
          if (raiseHandButtonProps.onToggleRaiseHand) {
            raiseHandButtonProps.onToggleRaiseHand();
          }
        },
        iconProps: { iconName: 'RaiseHandContextualMenuItem', styles: { root: { lineHeight: 0 } } },
        itemProps: {
          styles: buttonFlyoutIncreasedSizeStyles
        },
        disabled: isDisabled(options?.raiseHandButton),
        ['data-ui-id']: 'raise-hand-button'
      });
    }

    return items;
  };

  /* @conditional-compile-remove(PSTN-calls) */
  const [showDialpad, setShowDialpad] = useState(false);

  const theme = useTheme();

  const customButtons = useMemo(
    () => generateCustomControlBarButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  /* @conditional-compile-remove(PSTN-calls) */
  const onDismissDialpad = (): void => {
    setShowDialpad(false);
  };

  const screenShareButtonIsEnabled = isEnabled(options?.screenShareButton);

  const microphoneButtonIsEnabled = isEnabled(options?.microphoneButton);

  const cameraButtonIsEnabled = isEnabled(options?.cameraButton);

  /* @conditional-compile-remove(raise-hand) */
  const raiseHandButtonIsEnabled = isEnabled(options?.raiseHandButton);

  return (
    <Stack horizontalAlign="center" className={callControlsContainerStyles}>
      {
        /* @conditional-compile-remove(PSTN-calls) */
        <SendDtmfDialpad
          isMobile={!!props.isMobile}
          strings={dialpadStrings}
          showDialpad={showDialpad}
          onDismissDialpad={onDismissDialpad}
        />
      }
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
        <ControlBar
          layout={props.displayVertical ? 'vertical' : 'horizontal'}
          styles={controlBarStyles(theme.semanticColors.bodyBackground)}
        >
          {microphoneButtonIsEnabled && (
            <Microphone displayType={options?.displayType} disabled={isDisabled(options?.microphoneButton)} />
          )}
          {cameraButtonIsEnabled && (
            <Camera displayType={options?.displayType} disabled={isDisabled(options?.cameraButton)} />
          )}
          {
            /* @conditional-compile-remove(raise-hand) */ raiseHandButtonIsEnabled && !props.isMobile && (
              <RaiseHand displayType={options?.displayType} />
            )
          }
          {screenShareButtonIsEnabled && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              disabled={isDisabled(options?.screenShareButton)}
            />
          )}
          {isEnabled(options?.participantsButton) &&
            /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
            !props.isMobile && (
              <Participants
                option={options?.participantsButton}
                callInvitationURL={props.callInvitationURL}
                onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
                displayType={options?.displayType}
                increaseFlyoutItemSize={props.increaseFlyoutItemSize}
                isMobile={props.isMobile}
                disabled={isDisabled(options?.participantsButton)}
              />
            ) && (
              /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
              <People
                checked={props.peopleButtonChecked}
                ariaLabel={peopleButtonStrings?.label}
                showLabel={options?.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-composite-people-button"
                strings={peopleButtonStrings}
                disabled={isDisabled(options?.participantsButton)}
              />
            )}
          {isEnabled(options?.devicesButton) && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              disabled={isDisabled(options?.devicesButton)}
            />
          )}
          {
            /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
            isEnabled(options?.moreButton) && moreButtonContextualMenuItems().length > 0 && (
              <MoreButton
                data-ui-id="common-call-composite-more-button"
                strings={moreButtonStrings}
                menuIconProps={{ hidden: true }}
                menuProps={{ items: moreButtonContextualMenuItems() }}
                showLabel={options?.displayType !== 'compact'}
              />
            )
          }
          {customButtons['primary']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;

/** @private */
export const isRoomsCallTrampoline = (adapter: CommonCallAdapter): boolean => {
  /* @conditional-compile-remove(rooms) */
  return adapter.getState().isRoomsCall;

  return false;
};
