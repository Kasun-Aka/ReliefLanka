import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Field, Select, TextInput } from '../shared/Field';
import { DISTRICTS } from '../../data/districts';
import { Center } from '../../types/relief';
import { createId } from '../../utils/format';

interface CenterFormModalProps {
  open: boolean;
  initial: Center | null;
  onClose: () => void;
  onSave: (center: Center) => void;
}

interface FormState {
  centerName: string;
  district: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacity: string;
  operatingHours: string;
  isActive: boolean;
}

const EMPTY: FormState = {
  centerName: '',
  district: '',
  address: '',
  contactPerson: '',
  contactPhone: '',
  capacity: '',
  operatingHours: '',
  isActive: true
};

export function CenterFormModal({
  open,
  initial,
  onClose,
  onSave
}: CenterFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial ?
      {
        centerName: initial.centerName,
        district: initial.district,
        address: initial.address,
        contactPerson: initial.contactPerson,
        contactPhone: initial.contactPhone,
        capacity: String(initial.capacity),
        operatingHours: initial.operatingHours,
        isActive: initial.isActive
      } :
      EMPTY
    );
  }, [open, initial]);

  const set = (key: keyof FormState, value: string | boolean) =>
  setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.centerName.trim()) next.centerName = 'Center name is required.';
    if (!form.district) next.district = 'Select the district.';
    if (!form.contactPerson.trim()) next.contactPerson = 'Name a point of contact.';
    if (!/^\d{10}$/.test(form.contactPhone))
    next.contactPhone = 'Enter exactly 10 digits.';
    const capacity = Number(form.capacity);
    if (!form.capacity || Number.isNaN(capacity) || capacity < 1)
    next.capacity = 'Enter the daily intake capacity.';
    if (!form.operatingHours.trim()) next.operatingHours = 'State the opening hours.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      id: initial?.id ?? createId('CTR'),
      centerName: form.centerName.trim(),
      district: form.district,
      address: form.address.trim(),
      contactPerson: form.contactPerson.trim(),
      contactPhone: form.contactPhone.trim(),
      capacity,
      intakeToday: initial?.intakeToday ?? 0,
      operatingHours: form.operatingHours.trim(),
      isActive: form.isActive,
      createdAt: initial?.createdAt ?? new Date().toISOString()
    });
  };

  return (
    <Modal
      open={open}
      width="lg"
      title={initial ? `Edit ${initial.centerName}` : 'Register a drop-off center'}
      description="Donors use this directory to find where to hand over supplies."
      onClose={onClose}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {initial ? 'Save changes' : 'Register center'}
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Center name" htmlFor="ctr-name" error={errors.centerName}>
            <TextInput
              id="ctr-name"
              value={form.centerName}
              onChange={(e) => set('centerName', e.target.value)}
              placeholder="e.g. Ratnapura Town Hall Hub" />
            
          </Field>
        </div>
        <Field label="District" htmlFor="ctr-district" error={errors.district}>
          <Select
            id="ctr-district"
            options={DISTRICTS}
            placeholder="Select district"
            value={form.district}
            onChange={(e) => set('district', e.target.value)} />
          
        </Field>
        <Field label="Street address" htmlFor="ctr-address">
          <TextInput
            id="ctr-address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="e.g. Main St, opposite Clock Tower" />
          
        </Field>
        <Field label="Contact person" htmlFor="ctr-person" error={errors.contactPerson}>
          <TextInput
            id="ctr-person"
            value={form.contactPerson}
            onChange={(e) => set('contactPerson', e.target.value)}
            placeholder="e.g. S. Alwis" />
          
        </Field>
        <Field label="Contact phone" htmlFor="ctr-phone" error={errors.contactPhone}>
          <TextInput
            id="ctr-phone"
            value={form.contactPhone}
            inputMode="numeric"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={(e) => set('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="0450000000" />
          
        </Field>
        <Field
          label="Daily intake capacity"
          htmlFor="ctr-capacity"
          hint="Number of parcels the center can receive per day."
          error={errors.capacity}>
          
          <TextInput
            id="ctr-capacity"
            inputMode="numeric"
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            placeholder="e.g. 400" />
          
        </Field>
        <Field
          label="Operating hours"
          htmlFor="ctr-hours"
          error={errors.operatingHours}>
          
          <TextInput
            id="ctr-hours"
            value={form.operatingHours}
            onChange={(e) => set('operatingHours', e.target.value)}
            placeholder="e.g. 07:00 – 21:00 daily" />
          
        </Field>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2.5 rounded border border-line bg-subtle p-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line-strong text-brand-700 focus:ring-brand-600" />
            
            <span className="text-sm">
              <span className="font-medium text-ink">Accepting donations now</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Inactive centers stay listed but are hidden from the public drop-off
                directory.
              </span>
            </span>
          </label>
        </div>
      </div>
    </Modal>);

}