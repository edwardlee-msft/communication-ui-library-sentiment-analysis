// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { _CaptionsInfo } from '@internal/react-components';

const placeholderCaption: _CaptionsInfo = {
  id: '',
  displayName: '',
  captionText: ''
};

interface CaptionsUserContextType {
  captionsInfoArray: _CaptionsInfo[];
  setCaptionsInfoArray: React.Dispatch<React.SetStateAction<_CaptionsInfo[]>>;
}

const placeholderContextState = {
  captionsInfoArray: [placeholderCaption],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCaptionsInfoArray: () => {}
};

/**
 * @private
 */
export const CaptionsContext = React.createContext<CaptionsUserContextType>(placeholderContextState);

/**
 * @private
 */
export const CaptionsProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [captionsInfoArray, setCaptionsInfoArray] = useState<_CaptionsInfo[]>([placeholderCaption]);

  return (
    <CaptionsContext.Provider
      value={{ captionsInfoArray: captionsInfoArray, setCaptionsInfoArray: setCaptionsInfoArray }}
    >
      {props.children}
    </CaptionsContext.Provider>
  );
};
