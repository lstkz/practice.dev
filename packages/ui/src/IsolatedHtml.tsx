import React from 'react';
import { Button } from './Button';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Highlight } from './Highlight';

interface IsolatedHtmlProps {
  html: string;
  css: string;
  height: number;
  scripts?: string[];
}

const Buttons = styled.div`
  text-align: right;
  & > button + button {
    margin-left: 5px;
  }
`;

export function IsolatedHtml(props: IsolatedHtmlProps) {
  const [isHTMLVisible, setIsHTMLVisible] = React.useState(false);
  const [isCSSVisible, setIsCSSVisible] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>();
  const { html, css, height, scripts } = props;

  React.useLayoutEffect(() => {
    const document = iframeRef.current!.contentDocument!;
    document.body.innerHTML = html;
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
    (scripts || []).forEach(src => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      document.body.appendChild(script);
    });
  }, [html, css, scripts ? scripts.join() : null]);

  return (
    <>
      <Modal
        transparent
        isOpen={isCSSVisible}
        close={() => setIsCSSVisible(false)}
      >
        <Highlight code={css} lang="css" />
      </Modal>
      <Modal
        transparent
        isOpen={isHTMLVisible}
        close={() => setIsHTMLVisible(false)}
      >
        <Highlight code={html} lang="html" />
      </Modal>
      <iframe
        style={{ border: '1px dashed #ccc', width: '100%', height }}
        ref={iframeRef}
      />
      <Buttons>
        <Button small onClick={() => setIsHTMLVisible(true)}>
          Show HTML
        </Button>
        <Button small onClick={() => setIsCSSVisible(true)}>
          Show CSS
        </Button>
      </Buttons>
    </>
  );
}
