import React from 'react';
import { Link } from './Link';

interface BreadcrumbProps {
  path: Array<{ text: string; url: string } | string>;
}

export function Breadcrumb(props: BreadcrumbProps) {
  const { path } = props;

  return (
    <div
      className="breadcrumb"
      data-test="breadcrumb"
      data-test-dir="top-center"
    >
      {path.map((item, i) => {
        const testId = `bc-${i + 1}`;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="breadcrumb__separator">&gt;</span>}
            {typeof item === 'string' ? (
              <span data-test={testId} data-test-dir="top">
                {item}
              </span>
            ) : (
              <Link data-test={testId} data-test-dir="top" href={item.url}>
                {item.text}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
