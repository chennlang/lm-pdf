import { memo, useEffect } from 'react';
import { EasyPdfProps, Events } from './types';
import { PdfContext } from './context';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import Header from './header';
import Content from './canvas';
import mitt, { Emitter } from 'mitt';
import React from 'react';
import { activeViewerRectState } from './store';

export const EasyPdfHeader = Header;
export const EasyPdfViewer = Content;

export type EmitterType = Emitter<Events>;

// event 和 store 的桥梁
export const LocalEventProvider = ({
  emitter,
  children,
}: {
  emitter: EmitterType;
  children: React.ReactNode;
}) => {
  const setActiveViewerRectState = useSetRecoilState(activeViewerRectState);
  useEffect(() => {
    emitter.on('setActiveViewerRect', (config) => {
      setActiveViewerRectState(config);
    });
    return () => {
      emitter.off('setActiveViewerRect');
    };
  }, [emitter]);

  return children;
};

const LocalEasyPdfProvider = (props: EasyPdfProps) => {
  const emitter = mitt<Events>();
  const { children, emitterRef, ...attrs } = props;

  useEffect(() => {
    // 将 emitter 传递给外部
    if (emitterRef && typeof emitterRef === 'function') {
      emitterRef(emitter);
    } else if (
      emitterRef &&
      'current' in emitterRef &&
      (emitterRef as React.MutableRefObject<EmitterType>)
    ) {
      (emitterRef as React.MutableRefObject<EmitterType>).current = emitter;
    }

    return () => {
      emitter.all.clear();
    };
  }, [emitter]);

  return (
    <RecoilRoot>
      <PdfContext.Provider
        value={{
          ...attrs,
          emitter,
        }}
      >
        <LocalEventProvider emitter={emitter}>{children}</LocalEventProvider>
      </PdfContext.Provider>
    </RecoilRoot>
  );
};

export const EasyPdfProvider = memo(LocalEasyPdfProvider);
