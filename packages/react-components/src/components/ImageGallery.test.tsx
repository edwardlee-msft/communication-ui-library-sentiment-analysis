// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(image-gallery) */
import React from 'react';
/* @conditional-compile-remove(image-gallery) */
import { ImageGallery, ImageGalleryImageProps } from './ImageGallery';
/* @conditional-compile-remove(image-gallery) */
import { render, screen } from '@testing-library/react';
/* @conditional-compile-remove(image-gallery) */
import { registerIcons } from '@fluentui/react';

describe('ImageGallery default layout tests', () => {
  /* @conditional-compile-remove(image-gallery) */
  beforeAll(() => {
    registerIcons({
      icons: {
        cancel: <></>,
        download: <></>
      }
    });
  });
  test('Empty Mock Test', () => {
    expect(true).toBe(true);
  });

  /* @conditional-compile-remove(image-gallery) */
  const titleIconTestId1 = 'titleIconTestId1';
  /* @conditional-compile-remove(image-gallery) */
  const titleIconTestId2 = 'titleIconTestId2';
  /* @conditional-compile-remove(image-gallery) */
  const imageInfo = {
    imageUrl: 'images/inlineImageExample1.png',
    saveAsName: 'saveAsName',
    altText: 'altText',
    title: 'title',
    titleIcon: <div data-testid={titleIconTestId1}></div>
  };
  /* @conditional-compile-remove(image-gallery) */
  const imageInfo2 = {
    imageUrl: 'images/inlineImageExample2.png',
    saveAsName: 'saveAsName2',
    altText: 'altText2',
    title: 'title2',
    titleIcon: <div data-testid={titleIconTestId2}></div>
  };
  /* @conditional-compile-remove(image-gallery) */
  const renderImageGalleryComponent = (
    images?: Array<ImageGalleryImageProps>,
    startIndex?: number,
    onDismiss?: () => void,
    onImageDownloadButtonClicked?: () => void,
    onError?: () => void
  ): HTMLElement => {
    const imagesArray = images || [imageInfo];
    const { container } = render(
      <ImageGallery
        images={imagesArray}
        startIndex={startIndex}
        onDismiss={onDismiss || jest.fn()}
        onImageDownloadButtonClicked={onImageDownloadButtonClicked || jest.fn()}
        onError={onError || jest.fn()}
        isOpen={true}
      />
    );
    return container;
  };
  /* @conditional-compile-remove(image-gallery) */
  test('Show image gallery with required props', async () => {
    renderImageGalleryComponent();
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-gallery-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId1);
    expect(image.src).toContain(imageInfo.imageUrl);
    expect(image.alt).toBe(imageInfo.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });
  /* @conditional-compile-remove(image-gallery) */
  test('Show the correct image from images base on the startIndex', async () => {
    renderImageGalleryComponent([imageInfo, imageInfo2], 1);
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-gallery-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo2.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId2);
    expect(image.src).toContain(imageInfo2.imageUrl);
    expect(image.alt).toBe(imageInfo2.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  /* @conditional-compile-remove(image-gallery) */
  test('It should call the onDismiss handler when the close icon is clicked', async () => {
    const onDismissHandler = jest.fn();
    renderImageGalleryComponent(undefined, undefined, onDismissHandler);
    const buttons = await screen.findAllByRole('button', { name: 'Close' });
    expect(buttons.length).toBe(1);
    const closeButton: HTMLElement = buttons[0];
    closeButton.click();
    expect(onDismissHandler).toBeCalledTimes(1);
  });

  /* @conditional-compile-remove(image-gallery) */
  test('It should call the onImageDownloadButtonClicked handler when the download icon is clicked', async () => {
    const onImageDownloadButtonClicked = jest.fn();
    renderImageGalleryComponent(undefined, undefined, undefined, onImageDownloadButtonClicked);
    const buttons = await screen.findAllByRole('button', { name: 'Download' });
    expect(buttons.length).toBe(2);
    const downloadButton: HTMLElement = buttons[0];
    downloadButton.click();
    expect(onImageDownloadButtonClicked).toBeCalledTimes(1);
    expect(onImageDownloadButtonClicked).toBeCalledWith(imageInfo.imageUrl, imageInfo.saveAsName);
  });
});
