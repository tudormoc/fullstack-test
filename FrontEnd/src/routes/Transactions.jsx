import { useState, useEffect, useContext, useCallback } from 'react';
import { Tag, Form, Select, Card, Statistic, Row, Col, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import Api from '../helpers/core/Api';
import AuthContext from '../helpers/core/AuthContext';
import ContentPanel from '../components/core/layout/ContentPanel';
import Table from '../components/core/table/Table';
import TransactionForm from '../components/transactions/TransactionForm';
import { useFilters } from '../components/core/table/Filters';

const Transactions = () => {
  const { t } = useTranslation();
  const { logged } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  // Filter state for transaction type
  const [typeFilter, setTypeFilter] = useState(null);

  // Filters hook from the existing table component
  const filtersHook = useFilters('transactions');

  // Build the API base URL using the logged user's company
  const companyId = logged?.company?._id || logged?.company?.id;
  const baseUrl = `/companies/${companyId}/transactions`;

  // Fetch all transactions from the API
  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const params = { limit: 0, sorter: '-date' };
      if (typeFilter) params.type = typeFilter;

      const res = await Api.get(baseUrl, { params });
      setData(res.data || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, companyId, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create or update a transaction
  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      date: values.date?.toISOString()
    };

    if (editingRecord) {
      await Api.patch(`${baseUrl}/${editingRecord._id}`, payload);
    } else {
      await Api.post(baseUrl, payload);
    }

    setEditingRecord(null);
    form.resetFields();
    await fetchData();
  };

  // Delete a transaction by ID
  const handleDelete = async record => {
    await Api.delete(`${baseUrl}/${record._id}`);
    await fetchData();
  };

  // Open edit modal with pre-populated data
  const handleEdit = record => {
    setEditingRecord(record);
  };

  // Summary statistics computed from current data
  const totalIncome = data.filter(d => d.type === 'income').reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = data.filter(d => d.type === 'expense').reduce((sum, d) => sum + d.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Table column definitions
  const columns = [
    {
      title: t('common.date'),
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: val => <span className="font-medium">{dayjs(val).format('DD/MM/YYYY')}</span>
    },
    {
      title: t('common.type'),
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: val => <Tag className={`transaction-tag transaction-tag-${val}`}>{t(`transactions.${val}`)}</Tag>
    },
    {
      title: t('common.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (val, record) => (
        <span className={`transaction-amount transaction-amount-${record.type}`}>
          {record.type === 'income' ? '+' : '−'} € {val?.toFixed(2)}
        </span>
      )
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: val =>
        val ? (
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {val}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )
    }
  ];

  // Filter layout rendered inside the filter drawer
  const filterLayout = (
    <Form form={filterForm} layout="vertical">
      <Form.Item label={t('common.type')}>
        <Select
          allowClear
          placeholder={t('transactions.allTypes')}
          value={typeFilter}
          onChange={val => setTypeFilter(val || null)}
        >
          <Select.Option value="income">{t('transactions.income')}</Select.Option>
          <Select.Option value="expense">{t('transactions.expense')}</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );

  return (
    <ContentPanel title={t('transactions.title')} loading={!companyId}>
      {/* Summary cards with gradient accents */}
      <Row gutter={[16, 16]} className="transaction-summary-row">
        <Col xs={24} sm={8}>
          <Card size="small" className="transaction-summary-card summary-income">
            <Statistic
              title={t('transactions.totalIncome')}
              value={totalIncome}
              precision={2}
              prefix={<FontAwesomeIcon icon={faArrowTrendUp} />}
              suffix="€"
              valueStyle={{ color: '#059669', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" className="transaction-summary-card summary-expense">
            <Statistic
              title={t('transactions.totalExpenses')}
              value={totalExpenses}
              precision={2}
              prefix={<FontAwesomeIcon icon={faArrowTrendDown} />}
              suffix="€"
              valueStyle={{ color: '#dc2626', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" className="transaction-summary-card summary-balance">
            <Statistic
              title={t('transactions.balance')}
              value={balance}
              precision={2}
              prefix={<FontAwesomeIcon icon={faScaleBalanced} />}
              suffix="€"
              valueStyle={{ color: balance >= 0 ? '#059669' : '#dc2626', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Transactions table with CRUD */}
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        loading={loading}
        searchBar
        onChangeSearchBar={async e => {
          if (!companyId) return;
          setLoading(true);
          try {
            const params = { limit: 0, sorter: '-date', filter: e.target.value };
            if (typeFilter) params.type = typeFilter;
            const res = await Api.get(baseUrl, { params });
            setData(res.data || []);
          } catch (err) {
            console.error('Search failed:', err);
          } finally {
            setLoading(false);
          }
        }}
        sortableKeys={['date', 'amount', 'type']}
        deleteSaveButtonOnRow
        editCancelButtonOnRow
        onDelete={handleDelete}
        onEdit={handleEdit}
        filters={{
          ...filtersHook,
          layout: filterLayout,
          form: filterForm
        }}
        addForm={{
          title: editingRecord ? t('transactions.editTransaction') : t('transactions.addTransaction'),
          template: <TransactionForm form={form} editingRecord={editingRecord} />,
          onSave: handleSave,
          onCancel: () => {
            setEditingRecord(null);
            form.resetFields();
          },
          closeAfterSave: true,
          destroyOnClose: true
        }}
        locale={{
          emptyText: <Empty description={t('transactions.noTransactions')} />
        }}
      />
    </ContentPanel>
  );
};

export default Transactions;
