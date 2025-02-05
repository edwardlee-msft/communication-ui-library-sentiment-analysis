// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonCallAdapter, CallComposite } from '@azure/communication-react';
/* @conditional-compile-remove(call-readiness) */
import { CallCompositeOptions } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useIsMobile';
import React, { useEffect } from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useMemo } from 'react';
import { CallScreenProps } from './CallScreen';

export type CallCompositeContainerProps = CallScreenProps & { adapter?: CommonCallAdapter };

export const CallCompositeContainer = (props: CallCompositeContainerProps): JSX.Element => {
  const { adapter } = props;
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();

  /* @conditional-compile-remove(call-readiness) */
  const options: CallCompositeOptions = useMemo(
    () => ({
      onPermissionsTroubleshootingClick,
      onNetworkingTroubleShootingClick,
      callControls: {
        legacyControlBarExperience: false
      }
    }),
    []
  );

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  let callInvitationUrl: string | undefined = window.location.href;
  /* @conditional-compile-remove(rooms) */
  // If the call is a Rooms call we should not make call invitation link available
  if (adapter.getState().isRoomsCall) {
    callInvitationUrl = undefined;
  }

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      callInvitationUrl={callInvitationUrl}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      /* @conditional-compile-remove(call-readiness) */
      options={options}
    />
  );
};

/* @conditional-compile-remove(call-readiness) */
const onPermissionsTroubleshootingClick = (permissionState: {
  camera: PermissionState;
  microphone: PermissionState;
}): void => {
  console.log(permissionState);
  alert('permission troubleshooting clicked');
};

/* @conditional-compile-remove(call-readiness) */
const onNetworkingTroubleShootingClick = (): void => {
  alert('network troubleshooting clicked');
};
