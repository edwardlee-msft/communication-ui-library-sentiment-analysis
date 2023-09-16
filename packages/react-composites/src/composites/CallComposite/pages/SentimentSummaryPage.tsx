// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, useEffect, useState } from 'react';
import { IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import {
  containerStyle,
  moreDetailsStyles,
  containerItemGap,
  titleStyles,
  rejoinCallButtonContainerStyles,
  emojiSentimentStyles,
  addTopPaddingStyle
  // emojiSentimentStyles
} from '../styles/NoticePage.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { StartCallButton } from '../components/StartCallButton';
import { CallCompositeIcons } from '../../common/icons';
// import { ChartComponent } from './ChartComponent';
// import { CaptionsInfo } from '@internal/calling-stateful-client';
import { CaptionsContext } from '../../common/CaptionsProvider';
import {
  TextAnalyticsClient,
  AzureKeyCredential,
  AnalyzeSentimentResultArray,
  ExtractKeyPhrasesResultArray,
  AnalyzeSentimentResult,
  ExtractKeyPhrasesResult,
  AnalyzeSentimentSuccessResult,
  ExtractKeyPhrasesSuccessResult
} from '@azure/ai-text-analytics';
import { _CaptionsInfo } from '@internal/react-components';
import { ChartComponent } from './ChartComponent';

/**
 * @private
 */
const SENTIMENT_EXAMPLE: AnalyzeSentimentResult = {
  id: '0',
  warnings: [],
  sentiment: 'neutral',
  confidenceScores: {
    positive: 0,
    neutral: 0,
    negative: 0
  },
  sentences: [
    {
      confidenceScores: {
        positive: 0,
        neutral: 0,
        negative: 0
      },
      sentiment: 'neutral',
      text: '',
      offset: 0,
      length: 0,
      opinions: []
    }
  ]
};

const KEYPHRASE_EXAMPLE: ExtractKeyPhrasesResult = {
  id: '0',
  warnings: [],
  keyPhrases: ['']
};

/**
 * @private
 */
export interface SentimentSummaryPageProps {
  iconName?: keyof CallCompositeIcons;
  title: string;
  moreDetails?: string;
  dataUiId: string;
  disableStartCallButton?: boolean;
  pageStyle?: IStyle;
}

/**
 * @private
 */
export interface AnalysisInterface {
  sentimentAnalysis: {
    overall: Array<AnalyzeSentimentResult>;
    customer: Array<AnalyzeSentimentResult>;
    employee: Array<AnalyzeSentimentResult>;
  };
  keyPhrases: {
    overall: Array<ExtractKeyPhrasesResult>;
    customer: Array<ExtractKeyPhrasesResult>;
    employee: Array<ExtractKeyPhrasesResult>;
  };
}

/**
 * @private
 */
export interface sentimentConfidence {
  positive: [number];
  negative: [number];
  neutral: [number];
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function SentimentSummaryPage(props: SentimentSummaryPageProps): JSX.Element {
  const adapter = useAdapter();
  const { captionsInfoArray } = useContext(CaptionsContext);
  const [analysis, setAnalysis] = useState<AnalysisInterface>({
    sentimentAnalysis: { overall: [SENTIMENT_EXAMPLE], employee: [SENTIMENT_EXAMPLE], customer: [SENTIMENT_EXAMPLE] },
    keyPhrases: { overall: [KEYPHRASE_EXAMPLE], employee: [KEYPHRASE_EXAMPLE], customer: [KEYPHRASE_EXAMPLE] }
  });

  const [overallSentimentConfidenceArray, setOverallSentimentConfidenceArray] = useState<sentimentConfidence>({
    positive: [0],
    neutral: [0],
    negative: [0]
  });
  // const [employeeSentimentConfidenceArray, setEmployeeSentimentConfidenceArray] = useState<sentimentConfidence>({
  //   positive: [0],
  //   neutral: [0],
  //   negative: [0]
  // });
  // const [customerSentimentConfidenceArray, setCustomerSentimentConfidenceArray] = useState<sentimentConfidence>({
  //   positive: [0],
  //   neutral: [0],
  //   negative: [0]
  // });
  // const [captionsWithSentimentState, setCaptionsWithSentimentState] = useState<_CaptionsInfo[]>();
  // const [overallCaptionsToSend, setOverallCaptionsToSend] = useState<string>('');
  // const [customerCaptionsToSend, setCustomerCaptionsToSend] = useState<string>('');
  // const [employeeCaptionsToSend, setEmployeeCaptionsToSend] = useState<string>('');

  const [overallSentiment, setOverallSentiment] = useState<string>('');
  const [customerSentiment, setCustomerSentiment] = useState<string>('');
  const [employeeSentiment, setEmployeeSentiment] = useState<string>('');

  useEffect(() => {
    if (captionsInfoArray) {
      let overallCaptionsToSend = '';
      let customerCaptionsToSend = '';
      let employeeCaptionsToSend = '';
      const tempOverallSentimentConfidenceArray: sentimentConfidence = {
        positive: [0],
        neutral: [0],
        negative: [0]
      };
      const tempEmployeeSentimentConfidenceArray: sentimentConfidence = {
        positive: [0],
        neutral: [0],
        negative: [0]
      };
      const tempCustomerSentimentConfidenceArray: sentimentConfidence = {
        positive: [0],
        neutral: [0],
        negative: [0]
      };

      for (const caption of captionsInfoArray) {
        overallCaptionsToSend = overallCaptionsToSend + ' ' + caption.captionText;
        if (caption.sentimentAnalysis) {
          tempOverallSentimentConfidenceArray.positive.push(caption.sentimentAnalysis.confidenceScores.positive);
          tempOverallSentimentConfidenceArray.negative.push(caption.sentimentAnalysis.confidenceScores.negative);
          tempOverallSentimentConfidenceArray.neutral.push(caption.sentimentAnalysis.confidenceScores.neutral);
        }
        if (caption.isMicrosoftUser) {
          employeeCaptionsToSend = employeeCaptionsToSend + ' ' + caption.captionText;
          if (caption.sentimentAnalysis) {
            tempEmployeeSentimentConfidenceArray.positive.push(caption.sentimentAnalysis.confidenceScores.positive);
            tempEmployeeSentimentConfidenceArray.negative.push(caption.sentimentAnalysis.confidenceScores.negative);
            tempEmployeeSentimentConfidenceArray.neutral.push(caption.sentimentAnalysis.confidenceScores.neutral);
          }
        } else {
          customerCaptionsToSend = customerCaptionsToSend + ' ' + caption.captionText;
          if (caption.sentimentAnalysis) {
            tempCustomerSentimentConfidenceArray.positive.push(caption.sentimentAnalysis.confidenceScores.positive);
            tempCustomerSentimentConfidenceArray.negative.push(caption.sentimentAnalysis.confidenceScores.negative);
            tempCustomerSentimentConfidenceArray.neutral.push(caption.sentimentAnalysis.confidenceScores.neutral);
          }
        }
      }
      setOverallSentimentConfidenceArray(tempOverallSentimentConfidenceArray);
      // setEmployeeSentimentConfidenceArray(tempEmployeeSentimentConfidenceArray);
      // setCustomerSentimentConfidenceArray(tempCustomerSentimentConfidenceArray);
      const tempAnalysis = analysis;
      getSentimentAnalysis(overallCaptionsToSend, textAnalyticsClient).then((overall) => {
        tempAnalysis.sentimentAnalysis.overall = overall;
        getSentimentAnalysis(customerCaptionsToSend, textAnalyticsClient).then((customer) => {
          tempAnalysis.sentimentAnalysis.customer = customer;
          getSentimentAnalysis(employeeCaptionsToSend, textAnalyticsClient).then((employee) => {
            tempAnalysis.sentimentAnalysis.employee = employee;
            getKeyPhrases(overallCaptionsToSend, textAnalyticsClient).then((keyphraseOverall) => {
              tempAnalysis.keyPhrases.overall = keyphraseOverall;
              getKeyPhrases(customerCaptionsToSend, textAnalyticsClient).then((keyPhraseCustomer) => {
                tempAnalysis.keyPhrases.customer = keyPhraseCustomer;
                getKeyPhrases(employeeCaptionsToSend, textAnalyticsClient).then((keyPhraseEmployee) => {
                  tempAnalysis.keyPhrases.employee = keyPhraseEmployee;
                  setAnalysis(tempAnalysis);
                  setOverallSentiment(
                    (analysis.sentimentAnalysis.overall[0] as AnalyzeSentimentSuccessResult).sentiment
                  );
                  setEmployeeSentiment(
                    (analysis.sentimentAnalysis.employee[0] as AnalyzeSentimentSuccessResult).sentiment
                  );
                  setCustomerSentiment(
                    (analysis.sentimentAnalysis.customer[0] as AnalyzeSentimentSuccessResult).sentiment
                  );
                });
              });
            });
          });
        });
      });
    }
  }, [captionsInfoArray, analysis]);

  const sentimentEmoji = (sentiment: string): string => {
    return sentiment === 'positive'
      ? '😇'
      : sentiment === 'negative'
      ? '👿'
      : sentiment === 'neutral'
      ? '🙂'
      : sentiment === 'mixed'
      ? '😐'
      : '👀';
  };

  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      verticalAlign="center"
      horizontalAlign="center"
      data-ui-id={props.dataUiId}
      aria-atomic
    >
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        <Text className={mergeStyles(emojiSentimentStyles)}>
          {sentimentEmoji((analysis.sentimentAnalysis.overall[0] as AnalyzeSentimentSuccessResult).sentiment ?? '')}
        </Text>
        <Text className={mergeStyles(titleStyles)} aria-live="assertive">
          {props.title}
        </Text>
        <Text className={mergeStyles(moreDetailsStyles)} aria-live="assertive">
          {props.moreDetails}
        </Text>
        {captionsInfoArray && (
          <Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Overall Sentiment</Text>
              <Text className={mergeStyles(moreDetailsStyles)}>{overallSentiment ?? 'No sentiment to analyze'}</Text>
            </Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Employee Sentiment</Text>
              <Text className={mergeStyles(moreDetailsStyles)}>{employeeSentiment ?? 'No sentiment to analyze'}</Text>
            </Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Customer Sentiment</Text>
              <Text className={mergeStyles(moreDetailsStyles)}>{customerSentiment ?? 'No sentiment to analyze'}</Text>
            </Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Overall Key Phrases</Text>
              <Stack>
                {(analysis.keyPhrases.overall[0] as ExtractKeyPhrasesSuccessResult).keyPhrases ? (
                  (analysis.keyPhrases.overall[0] as ExtractKeyPhrasesSuccessResult).keyPhrases.map((a) => {
                    return (
                      <div key={a}>
                        <Text className={mergeStyles(moreDetailsStyles)}>{a}</Text>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <Text className={mergeStyles(moreDetailsStyles)}>No Key Phrases found</Text>
                  </div>
                )}
              </Stack>
            </Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Employee Key Phrases</Text>
              <Stack>
                {(analysis.keyPhrases.employee[0] as ExtractKeyPhrasesSuccessResult).keyPhrases ? (
                  (analysis.keyPhrases.employee[0] as ExtractKeyPhrasesSuccessResult).keyPhrases.map((a) => {
                    return (
                      <div key={a}>
                        <Text className={mergeStyles(moreDetailsStyles)}>{a}</Text>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <Text className={mergeStyles(moreDetailsStyles)}>No Key Phrases found</Text>
                  </div>
                )}
              </Stack>
            </Stack>
            <Stack>
              <Text className={mergeStyles(titleStyles, addTopPaddingStyle)}>Customer Key Phrases</Text>
              <Stack>
                {(analysis.keyPhrases.customer[0] as ExtractKeyPhrasesSuccessResult).keyPhrases ? (
                  (analysis.keyPhrases.customer[0] as ExtractKeyPhrasesSuccessResult).keyPhrases.map((a) => {
                    return (
                      <div key={a}>
                        <Text className={mergeStyles(moreDetailsStyles)}>{a}</Text>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <Text className={mergeStyles(moreDetailsStyles)}>No Key Phrases found</Text>
                  </div>
                )}
              </Stack>
            </Stack>
            {overallSentimentConfidenceArray && captionsInfoArray && (
              <ChartComponent
                sentimentConfidenceArray={overallSentimentConfidenceArray}
                captionsWithSentiment={captionsInfoArray}
              ></ChartComponent>
            )}
          </Stack>
        )}
        {!props.disableStartCallButton && (
          <Stack styles={rejoinCallButtonContainerStyles}>
            <StartCallButton onClick={() => adapter.joinCall()} disabled={false} rejoinCall={true} autoFocus />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

// const TEXT_ANALYTICS_ENDPOINT = process.env.TextAnalyticsEndpoint ?? '';
// const TEXT_ANALYTICS_API_KEY = process.env.TextAnalyticsApiKey ?? '';
// asdfTODO: ADD KEYS HERE:
const TEXT_ANALYTICS_ENDPOINT = '';
const TEXT_ANALYTICS_API_KEY = '';

const textAnalyticsClient = new TextAnalyticsClient(
  TEXT_ANALYTICS_ENDPOINT,
  new AzureKeyCredential(TEXT_ANALYTICS_API_KEY)
);

const getSentimentAnalysis = async (
  text: string,
  client: TextAnalyticsClient
): Promise<AnalyzeSentimentResultArray> => {
  return await client.analyzeSentiment([text ?? '']);
};

const getKeyPhrases = async (text: string, client: TextAnalyticsClient): Promise<ExtractKeyPhrasesResultArray> => {
  return await client.extractKeyPhrases([text ?? '']);
};
