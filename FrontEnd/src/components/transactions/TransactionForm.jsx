import { useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { TextArea } = Input;

// Reusable form for creating/editing transactions, used inside the Table modal
const TransactionForm = ({ form, editingRecord = null }) => {
  const { t } = useTranslation();

  // Pre-populate form when editing an existing transaction
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        type: editingRecord.type,
        amount: editingRecord.amount,
        description: editingRecord.description,
        category: editingRecord.category,
        date: editingRecord.date ? dayjs(editingRecord.date) : dayjs()
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ date: dayjs() });
    }
  }, [editingRecord, form]);

  return (
    <Form form={form} layout="vertical" initialValues={{ type: 'expense', date: dayjs() }}>
      <Form.Item name="type" label={t('common.type')} rules={[{ required: true, message: t('validation.required') }]}>
        <Select>
          <Select.Option value="expense">{t('transactions.expense')}</Select.Option>
          <Select.Option value="income">{t('transactions.income')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label={t('common.amount')}
        rules={[{ required: true, message: t('validation.required') }]}
      >
        <InputNumber min={0.01} step={0.01} precision={2} className="w-full" addonAfter="€" />
      </Form.Item>

      <Form.Item name="description" label={t('common.description')}>
        <TextArea rows={3} maxLength={500} showCount />
      </Form.Item>

      <Form.Item name="category" label={t('common.category')}>
        <Input maxLength={128} />
      </Form.Item>

      <Form.Item name="date" label={t('common.date')} rules={[{ required: true, message: t('validation.required') }]}>
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
