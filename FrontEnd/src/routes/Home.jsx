import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import ContentPanel from '../components/core/layout/ContentPanel';
import AuthContext from '../helpers/core/AuthContext';

const { Title, Paragraph } = Typography;

// Home page — clean welcome screen that guides users to the Transactions page
const Home = () => {
  const { t } = useTranslation();
  const { logged } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <ContentPanel title={t('common.home')}>
      <Row justify="center" className="mt-8">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card
            className="text-center"
            style={{
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 4px 24px rgba(79, 70, 229, 0.06)'
            }}
          >
            <div
              className="mx-auto mb-6 flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)'
              }}
            >
              <FontAwesomeIcon icon={faWallet} size="2x" style={{ color: '#fff' }} />
            </div>

            <Title level={3} className="mb-2">
              {t('login.welcome')}, {logged?.name || logged?.fullname || ''}! 👋
            </Title>

            <Paragraph type="secondary" className="mb-6 text-base">
              {t('transactions.noTransactions')
                .replace('. Click + to add one.', '')
                .replace('. Clicca + per aggiungerne una.', '')}
              <br />
              {t('common.description')}: {t('transactions.title').toLowerCase()}
            </Paragraph>

            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/transactions')}
              style={{
                borderRadius: 10,
                height: 44,
                paddingInline: 32,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
              }}
            >
              {t('transactions.title')}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </Card>
        </Col>
      </Row>
    </ContentPanel>
  );
};

export default Home;
