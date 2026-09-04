import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Field, Select, TextArea, TextInput } from '../shared/Field';
import { DISTRICTS } from '../../data/districts';
import { ReliefRequest, URGENCIES, Urgency } from '../../types/relief';
import { createId } from '../../utils/format';

interface RequestFormModalProps {
  open: boolean;
  initial: ReliefRequest | null;
  onClose: () => void;
  onSave: (request: ReliefRequest) => void;
}

interface FormState {
  name: string;
  district: string;
  contactPhone: string;
  itemsNeeded: string;
  peopleAffected: string;
  urgency: Urgency;
}

const EMPTY: FormState = {
  name: '',
  district: '',
  contactPhone: '',
  itemsNeeded: '',
  peopleAffected: '',
  urgency: 'Medium'
};

export function RequestFormModal({
  open,
  initial,
  onClose,
  onSave
}: RequestFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial ?
      {
        name: initial.name,
        district: initial.district,
        contactPhone: initial.contactPhone,
        itemsNeeded: initial.itemsNeeded.join(', '),
        peopleAffected: String(initial.peopleAffected),
        urgency: initial.urgency
      } :
      EMPTY
    );
  }, [open, initial]);

  const set = (key: keyof FormState, value: string) =>
  setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Requester name is required.';
    if (!form.district) next.district = 'Select the affected district.';
    if (!/^[0-9+\s()-]{9,}$/.test(form.contactPhone.trim()))
    next.contactPhone = 'Enter a reachable phone number.';
    if (!form.itemsNeeded.trim()) next.itemsNeeded = 'List at least one item.';
    const people = Number(form.peopleAffected);
    if (!form.peopleAffected || Number.isNaN(people) || people < 1)
    next.peopleAffected = 'Enter how many people are affected.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      id: initial?.id ?? createId('REQ'),
      name: form.name.trim(),
      district: form.district,
      contactPhone: form.contactPhone.trim(),
      itemsNeeded: form.itemsNeeded.
      split(',').
      map((item) => item.trim()).
      filter(Boolean),
      peopleAffected: people,
      urgency: form.urgency,
      status: initial?.status ?? 'Pending',
      createdAt: initial?.createdAt ?? new Date().toISOString()
    });
  };

  return (
    <Modal
      open={open}
      title={initial ? `Edit request ${initial.id}` : 'Log a relief request'}
      description={
      initial ?
      'Update the details captured for this household or community.' :
      'Capture what is needed and where, so coordinators can match supply to demand.'
      }
      onClose={onClose}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {initial ? 'Save changes' : 'Submit request'}
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Requester name" htmlFor="req-name" error={errors.name}>
          <TextInput
            id="req-name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Nuwan Perera" />
          
        </Field>
        <Field label="Contact phone" htmlFor="req-phone" error={errors.contactPhone}>
          <TextInput
            id="req-phone"
            value={form.contactPhone}
            onChange={(e) => set('contactPhone', e.target.value)}
            placeholder="077 000 0000" />
          
        </Field>
        <Field label="District" htmlFor="req-district" error={errors.district}>
          <Select
            id="req-district"
            options={DISTRICTS}
            placeholder="Select district"
            value={form.district}
            onChange={(e) => set('district', e.target.value)} />
          
        </Field>
        <Field
          label="People affected"
          htmlFor="req-people"
          error={errors.peopleAffected}>
          
          <TextInput
            id="req-people"
            inputMode="numeric"
            value={form.peopleAffected}
            onChange={(e) => set('peopleAffected', e.target.value)}
            placeholder="e.g. 24" />
          
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Items needed"
            htmlFor="req-items"
            hint="Separate each item with a comma."
            error={errors.itemsNeeded}>
            
            <TextArea
              id="req-items"
              rows={3}
              value={form.itemsNeeded}
              onChange={(e) => set('itemsNeeded', e.target.value)}
              placeholder="Drinking water, baby formula, blankets" />
            
          </Field>
        </div>
        <Field
          label="Urgency"
          htmlFor="req-urgency"
          hint="High marks a life-safety need within 24 hours.">
          
          <Select
            id="req-urgency"
            options={URGENCIES}
            value={form.urgency}
            onChange={(e) => set('urgency', e.target.value as Urgency)} />
          
        </Field>
      </div>
    </Modal>);

}