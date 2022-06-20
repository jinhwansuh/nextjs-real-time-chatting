import { ReactNode, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { CSSProperties } from 'styled-components';

interface ModalProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  visible: boolean;
  onClose: () => void;
  style?: CSSProperties;
}

const Modal = ({
  children,
  width = 500,
  height = 500,
  visible = false,
  onClose,
  ...props
}: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const containerStyle = useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );

  const el = useMemo(() => document.createElement('div'), [isBrowser]);
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  if (isBrowser) {
    return ReactDOM.createPortal(
      <BackgroundDim style={{ display: visible ? 'block' : 'none' }}>
        <ModalContainer
          {...props}
          style={{ ...props.style, ...containerStyle }}
        >
          {children}
        </ModalContainer>
      </BackgroundDim>,
      el
    );
  } else {
    return null;
  }
};

const BackgroundDim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;

export default Modal;
