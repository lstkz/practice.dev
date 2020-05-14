import React from 'react';
import { useFaqModule } from '../module';
import styled from 'styled-components';
import { Box } from 'src/components/Box';
import { Dashboard } from 'src/components/Dashboard';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { FaqIcon } from 'src/icons/FaqIcon';
import { createUrl, getRouteParams } from 'src/common/url';
import { Theme } from 'ui';
import { Link } from 'src/components/Link';
import { TwoColLayout } from 'src/components/TwoColLayout';
import { FaqMenu } from './FaqMenu';
import { getRouterState } from 'typeless-router';
import { faqGroups } from '../faqList';

const Wrapper = styled(Box)`
  width: 100%;
  padding: 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: ${Theme.textDark};
`;

const Desc = styled.div`
  margin-top: 10px;
`;

export function FaqView() {
  useFaqModule();
  const { location } = getRouterState.useState();
  const item = React.useMemo(() => {
    const defaultItem = faqGroups[0].items[0];
    if (!location) {
      return defaultItem;
    }
    const { slug } = getRouteParams('faq');
    if (slug) {
      for (const group of faqGroups) {
        for (const item of group.items) {
          if (item.slug === slug) {
            return item;
          }
        }
      }
    }
    return defaultItem;
  }, [location]);

  return (
    <Dashboard>
      <Container data-test="faq-page">
        <Breadcrumb
          icon={<FaqIcon />}
          url={createUrl({ name: 'faq' })}
          root="FAQs"
        />
        <Top>
          <Title>Frequently Asked Questions</Title>
          <div>
            Can’t find what you’re looking for?{' '}
            <Link href={createUrl({ name: 'contact-us' })}>Contact us</Link>
          </div>
        </Top>
        <Wrapper>
          <TwoColLayout
            width={270}
            relative
            left={<FaqMenu slug={item.slug} />}
            right={
              <>
                <Title data-test="faq-title">{item.title}</Title>
                <Desc data-test="faq-content">{item.content}</Desc>
              </>
            }
          />
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
