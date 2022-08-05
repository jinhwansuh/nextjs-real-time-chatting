import { memo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  block?: boolean;
  paragraph?: boolean;
  size?: number | 'small' | 'normal' | 'large';
  strong?: boolean;
  underline?: boolean;
  delete?: boolean;
  color?: string;
  mark?: boolean;
  code?: boolean;
  [x: string]: any;
}

const Text = ({
  children,
  block,
  paragraph,
  size,
  strong,
  underline,
  delete: del,
  color,
  mark,
  code,
  ...rest
}: Props) => {
  const Tag = block ? 'div' : paragraph ? 'p' : 'span';

  const fontStyle = {
    fontWeight: strong ? 'bold' : undefined,
    fontSize: typeof size === 'string' ? undefined : size,
    textDecoration: underline ? 'underline' : undefined,
    color,
  };

  if (mark) {
    children = <mark>{children}</mark>;
  }
  if (code) {
    children = <code>{children}</code>;
  }
  if (del) {
    children = <del>{children}</del>;
  }

  return (
    <Tag style={{ ...rest.style, ...fontStyle }} {...rest}>
      {children}
    </Tag>
  );
};

export default memo(Text);
