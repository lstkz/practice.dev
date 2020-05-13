import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { SwaggerContext } from './SwaggerContext';
import { SchemaViewer } from '../SchemaViewer/SchemaViewer';
import { IntersectionWrapper } from './IntersectionWrapper';

interface SchemaListProps {
  className?: string;
}

const Title = styled.div`
  color: ${Theme.textDark};
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 10px;
`;

const _SchemaList = (props: SchemaListProps) => {
  const { className } = props;
  const spec = React.useContext(SwaggerContext);

  return (
    <div className={className}>
      <Title>Schemas</Title>
      {Object.entries(spec.components.schemas).map(([name, schema]) => (
        <IntersectionWrapper key={name} id={'schema-' + name}>
          <SchemaViewer
            name={name}
            type={schema}
            schemas={spec.components.schemas}
          />
        </IntersectionWrapper>
      ))}
    </div>
  );
};

export const SchemaList = styled(_SchemaList)`
  display: block;
  margin-top: 25px;
  ${SchemaViewer} {
    margin-bottom: 10px;
  }
`;
