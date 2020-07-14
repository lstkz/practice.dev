import * as React from 'react';
import styled, { css } from 'styled-components';
import { DisplayGroupItem } from './utils';
import { Theme } from 'src/Theme';
import { HttpTag } from './HttpTag';
import { SwaggerSection } from './SwaggerSection';
import { SwaggerResponses } from './SwaggerResponses';
import { Markdown } from '../Markdown';
import { IntersectionWrapper } from './IntersectionWrapper';
import { SchemaViewer } from '../SchemaViewer/SchemaViewer';
import { SwaggerContext } from './SwaggerContext';
import { SwaggerParameters } from './SwaggerParameters';

interface SwaggerDisplayGroupItemProps {
  className?: string;
  item: DisplayGroupItem;
}

const Header = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
`;

const Path = styled.div`
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
`;

const Main = styled.div`
  border-top: 1px solid transparent;
  padding: 25px 20px 20px;
`;

const Desc = styled.div`
  white-space: pre-line;
`;

const RequestBody = styled.div`
  border-radius: 5px;
  background: white;
  padding: 20px;
  ${SwaggerSection} {
    margin-top: 0;
  }
`;

const _SwaggerDisplayGroupItem = (props: SwaggerDisplayGroupItemProps) => {
  const { className, item } = props;
  const spec = React.useContext(SwaggerContext);
  const { operationId, parameters, requestBody } = item.def;

  return (
    <IntersectionWrapper id={operationId} className={className}>
      <Header>
        <HttpTag type={item.method} /> <Path>{item.path}</Path>
      </Header>
      <Main>
        <Desc>
          <Markdown>{item.def.description}</Markdown>
        </Desc>
        {parameters && parameters.length > 0 && (
          <SwaggerSection title="Parameters">
            <SwaggerParameters parameters={parameters} />
          </SwaggerSection>
        )}
        {requestBody && (
          <SwaggerSection title="Request body">
            <RequestBody>
              <SchemaViewer
                schemas={spec.components.schemas}
                type={requestBody.content['application/json'].schema}
              />
            </RequestBody>
          </SwaggerSection>
        )}

        <SwaggerSection title="Responses">
          <SwaggerResponses method={item.def} />
        </SwaggerSection>
      </Main>
    </IntersectionWrapper>
  );
};

export const SwaggerDisplayGroupItem = styled(_SwaggerDisplayGroupItem)`
  display: block;
  border-radius: 5px;
  border: 1px solid transparent;

  & + & {
    margin-top: 25px;
  }

  ${props => {
    switch (props.item.method) {
      case 'get':
        return css`
          border-color: ${Theme.httpGetDark};
          background: ${Theme.httpGetLight};
          ${Main} {
            border-color: ${Theme.httpGetDark};
          }
        `;
      case 'post':
        return css`
          border-color: ${Theme.httpPostDark};
          background: ${Theme.httpPostLight};
          ${Main} {
            border-color: ${Theme.httpPostDark};
          }
        `;
      case 'put':
        return css`
          border-color: ${Theme.httpPutDark};
          background: ${Theme.httpPutLight};
          ${Main} {
            border-color: ${Theme.httpPutDark};
          }
        `;
      case 'delete':
        return css`
          border-color: ${Theme.httpDeleteDark};
          background: ${Theme.httpDeleteLight};
          ${Main} {
            border-color: ${Theme.httpDeleteDark};
          }
        `;
    }
  }}
`;
