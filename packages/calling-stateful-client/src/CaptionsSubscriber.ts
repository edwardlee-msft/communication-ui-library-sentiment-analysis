// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(close-captions) */
import {
  PropertyChangedEvent,
  TeamsCaptions,
  TeamsCaptionsHandler,
  TeamsCaptionsInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(close-captions) */
import { CallIdRef } from './CallIdRef';
import {
  TextAnalyticsClient,
  AzureKeyCredential,
  AnalyzeSentimentResultArray,
  AnalyzeSentimentSuccessResult
} from '@azure/ai-text-analytics';
import { CaptionsInfo } from './CallClientState';

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
export class CaptionsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: TeamsCaptions;
  private _listOfCaptions: CaptionsInfo[] | [] = [];

  constructor(callIdRef: CallIdRef, context: CallContext, captions: TeamsCaptions) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;
    if (this._captions.isCaptionsFeatureActive) {
      this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
    }
    this._context.setAvailableSpokenLanguages(this._callIdRef.callId, this._captions.supportedSpokenLanguages);
    if ('supportedCaptionLanguages' in this._captions) {
      this._context.setAvailableCaptionLanguages(this._callIdRef.callId, this._captions.supportedCaptionLanguages);
    }
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
    this._context.setSelectedCaptionLanguage(this._callIdRef.callId, this._captions.activeCaptionLanguage);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.on('CaptionsReceived', this.onCaptionsReceived);
    this._captions.on('CaptionLanguageChanged', this.isCaptionLanguageChanged);
    this._captions.on('SpokenLanguageChanged', this.isSpokenLanguageChanged);
  };

  public unsubscribe = (): void => {
    this._captions.off('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.off('CaptionsReceived', this.onCaptionsReceived);
    this._captions.off('CaptionLanguageChanged', this.isCaptionLanguageChanged);
    this._captions.off('SpokenLanguageChanged', this.isSpokenLanguageChanged);
  };

  private onCaptionsReceived: TeamsCaptionsHandler = (caption: TeamsCaptionsInfo): void => {
    this.getSentimentAnalysis(caption.captionText, this.textAnalyticsClient).then((a) => {
      const sentimentResult = a[0] as AnalyzeSentimentSuccessResult;
      this._context.addCaption(this._callIdRef.callId, caption, sentimentResult, this._listOfCaptions);
    });
  };

  // private TEXT_ANALYTICS_ENDPOINT = process.env.TextAnalyticsEndpoint ?? '';
  // private TEXT_ANALYTICS_API_KEY = process.env.TextAnalyticsApiKey ?? '';

  // asdfTODO: ADD KEYS HERE:
  private TEXT_ANALYTICS_ENDPOINT = '';
  private TEXT_ANALYTICS_API_KEY = '';

  private textAnalyticsClient = new TextAnalyticsClient(
    this.TEXT_ANALYTICS_ENDPOINT,
    new AzureKeyCredential(this.TEXT_ANALYTICS_API_KEY)
  );

  private getSentimentAnalysis = async (
    text: string,
    client: TextAnalyticsClient
  ): Promise<AnalyzeSentimentResultArray> => {
    return await client.analyzeSentiment([text ?? '']);
  };

  private isCaptionsActiveChanged: PropertyChangedEvent = (): void => {
    this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
  };
  private isCaptionLanguageChanged: PropertyChangedEvent = (): void => {
    this._context.setSelectedCaptionLanguage(this._callIdRef.callId, this._captions.activeCaptionLanguage);
  };
  private isSpokenLanguageChanged: PropertyChangedEvent = (): void => {
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
  };
}

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
