// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { CSSProperties, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { sentimentConfidence } from './SentimentSummaryPage';
import { _CaptionsInfo } from '@internal/react-components';

/**
 * @private
 */
export interface ChartComponentProps {
  sentimentConfidenceArray: sentimentConfidence;
  captionsWithSentiment: _CaptionsInfo[];
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function ChartComponent(props: ChartComponentProps): JSX.Element {
  const { sentimentConfidenceArray } = props;
  useEffect(() => {
    let counter = 1;
    const counterArray: number[] = [1];
    while (counter < sentimentConfidenceArray.negative.length) {
      counter++;
      counterArray.push(counter);
    }

    const myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: counterArray,
        datasets: [
          {
            label: 'Positive',
            data: sentimentConfidenceArray.positive,
            borderWidth: 1
          },
          {
            label: 'Neutral',
            data: sentimentConfidenceArray.neutral,
            borderWidth: 1
          },
          {
            label: 'Negative',
            data: sentimentConfidenceArray.negative,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      myChart.destroy();
    };
  }, [sentimentConfidenceArray.negative, sentimentConfidenceArray.neutral, sentimentConfidenceArray.positive]);

  return (
    <>
      <canvas id="myChart" style={canvasStyle}></canvas>
    </>
  );
}

const canvasStyle: CSSProperties = { width: '100%', height: '100%' };
