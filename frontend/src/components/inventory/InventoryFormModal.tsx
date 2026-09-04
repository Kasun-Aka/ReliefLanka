import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Field, Select, TextInput } from '../shared/Field';
import { DISTRICTS } from '../../data/districts';
import {
  INVENTORY_CATEGORIES,
  InventoryCategory,
  InventoryItem } from
'../../types/relief';
import { createId } from '../../utils/format';

interface InventoryFormModalProps {
  open: boolean;
  initial: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

interface FormState {
  itemName: string;
  category: InventoryCategory;
  quantity: string;
  reorderLevel: string;
  unit: string;
  storageLocation: string;
  district: string;
}

const EMPTY: FormState = {
  itemName: '',
  category: 'Water',
  quantity: '',
  reorderLevel: '',
  unit: '',
  storageLocation: '',
  district: ''
};

export function InventoryFormModal({
  open,
  initial,
  onClose,
  onSave
}: InventoryFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial ?
      {
        itemName: initial.itemName,
        category: initial.category,
        quantity: String(initial.quantity),
        reorderLevel: String(initial.reorderLevel),
        unit: initial.unit,
        storageLocation: initial.storageLocation,
        district: initial.district
      } :
      EMPTY
    );
  }, [open, initial]);

  const set = (key: keyof FormState, value: string) =>
  setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.itemName.trim()) next.itemName = 'Item name is required.';
    const quantity = Number(form.quantity);
    if (!form.quantity || Number.isNaN(quantity) || quantity < 0)
    next.quantity = 'Enter the quantity in stock.';
    const reorder = Number(form.reorderLevel);
    if (!form.reorderLevel || Number.isNaN(reorder) || reorder < 0)
    next.reorderLevel = 'Set the level that triggers a restock.';
    if (!form.unit.trim()) next.unit = 'Add a unit, e.g. liters or boxes.';
    if (!form.storageLocation.trim()) next.storageLocation = 'Where is this stored?';
    if (!form.district) next.district = 'Select the district.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      id: initial?.id ?? createId('INV'),
      itemName: form.itemName.trim(),
      category: form.category,
      quantity,
      reorderLevel: reorder,
      unit: form.unit.trim(),
      storageLocation: form.storageLocation.trim(),
      district: form.district,
      loggedAt: new Date().toISOString()
    });
  };

  return (
    <Modal
      open={open}
      width="lg"
      title={initial ? `Edit ${initial.itemName}` : 'Log relief stock'}
      description="Stock is tracked per district so coordinators can match it to open requests."
      onClose={onClose}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {initial ? 'Save changes' : 'Add to inventory'}
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Item name" htmlFor="inv-name" error={errors.itemName}>
          <TextInput
            id="inv-name"
            value={form.itemName}
            onChange={(e) => set('itemName', e.target.value)}
            placeholder="e.g. Bottled drinking water" />
          
        </Field>
        <Field label="Category" htmlFor="inv-category">
          <Select
            id="inv-category"
            options={INVENTORY_CATEGORIES}
            value={form.category}
            onChange={(e) => set('category', e.target.value as InventoryCategory)} />
          
        </Field>
        <Field label="Quantity in stock" htmlFor="inv-qty" error={errors.quantity}>
          <TextInput
            id="inv-qty"
            inputMode="numeric"
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
            placeholder="e.g. 4200" />
          
        </Field>
        <Field label="Unit" htmlFor="inv-unit" error={errors.unit}>
          <TextInput
            id="inv-unit"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
            placeholder="liters · kg · boxes" />
          
        </Field>
        <Field
          label="Reorder level"
          htmlFor="inv-reorder"
          hint="Stock below this is flagged as low."
          error={errors.reorderLevel}>
          
          <TextInput
            id="inv-reorder"
            inputMode="numeric"
            value={form.reorderLevel}
            onChange={(e) => set('reorderLevel', e.target.value)}
            placeholder="e.g. 2000" />
          
        </Field>
        <Field label="District" htmlFor="inv-district" error={errors.district}>
          <Select
            id="inv-district"
            options={DISTRICTS}
            placeholder="Select district"
            value={form.district}
            onChange={(e) => set('district', e.target.value)} />
          
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Storage location"
            htmlFor="inv-location"
            error={errors.storageLocation}>
            
            <TextInput
              id="inv-location"
              value={form.storageLocation}
              onChange={(e) => set('storageLocation', e.target.value)}
              placeholder="e.g. Colombo Central Warehouse" />
            
          </Field>
        </div>
      </div>
    </Modal>);

}