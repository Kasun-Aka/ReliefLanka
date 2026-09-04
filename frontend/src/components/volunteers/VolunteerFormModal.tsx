import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { ChipGroup, Field, Select, TextInput } from '../shared/Field';
import { DISTRICTS } from '../../data/districts';
import {
  AVAILABILITIES,
  Availability,
  Volunteer,
  VOLUNTEER_SKILLS,
  VolunteerSkill } from
'../../types/relief';
import { createId } from '../../utils/format';

interface VolunteerFormModalProps {
  open: boolean;
  initial: Volunteer | null;
  onClose: () => void;
  onSave: (volunteer: Volunteer) => void;
}

interface FormState {
  name: string;
  phone: string;
  preferredDistrict: string;
  skills: VolunteerSkill[];
  availability: Availability;
}

const EMPTY: FormState = {
  name: '',
  phone: '',
  preferredDistrict: '',
  skills: [],
  availability: 'Available'
};

export function VolunteerFormModal({
  open,
  initial,
  onClose,
  onSave
}: VolunteerFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial ?
      {
        name: initial.name,
        phone: initial.phone,
        preferredDistrict: initial.preferredDistrict,
        skills: initial.skills,
        availability: initial.availability
      } :
      EMPTY
    );
  }, [open, initial]);

  const toggleSkill = (skill: VolunteerSkill) =>
  setForm((prev) => ({
    ...prev,
    skills: prev.skills.includes(skill) ?
    prev.skills.filter((s) => s !== skill) :
    [...prev.skills, skill]
  }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Volunteer name is required.';
    if (!/^\d{10}$/.test(form.phone))
    next.phone = 'Enter exactly 10 digits.';
    if (!form.preferredDistrict) next.preferredDistrict = 'Select a preferred district.';
    if (form.skills.length === 0) next.skills = 'Pick at least one skill.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      id: initial?.id ?? createId('VOL'),
      name: form.name.trim(),
      phone: form.phone.trim(),
      preferredDistrict: form.preferredDistrict,
      skills: form.skills,
      availability: form.availability,
      createdAt: initial?.createdAt ?? new Date().toISOString()
    });
  };

  return (
    <Modal
      open={open}
      title={initial ? `Edit ${initial.name}` : 'Register a volunteer'}
      description="Coordinators deploy volunteers by district and skill, so both matter."
      onClose={onClose}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {initial ? 'Save changes' : 'Register volunteer'}
          </Button>
        </>
      }>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="vol-name" error={errors.name}>
          <TextInput
            id="vol-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Suresh Ganeshan" />
          
        </Field>
        <Field label="Phone" htmlFor="vol-phone" error={errors.phone}>
          <TextInput
            id="vol-phone"
            value={form.phone}
            inputMode="numeric"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="0710000000" />
          
        </Field>
        <Field
          label="Preferred district"
          htmlFor="vol-district"
          error={errors.preferredDistrict}>
          
          <Select
            id="vol-district"
            options={DISTRICTS}
            placeholder="Select district"
            value={form.preferredDistrict}
            onChange={(e) => setForm({ ...form, preferredDistrict: e.target.value })} />
          
        </Field>
        <Field label="Availability" htmlFor="vol-availability">
          <Select
            id="vol-availability"
            options={AVAILABILITIES}
            value={form.availability}
            onChange={(e) =>
            setForm({ ...form, availability: e.target.value as Availability })
            } />
          
        </Field>
        <div className="sm:col-span-2">
          <ChipGroup
            legend="Skills"
            options={VOLUNTEER_SKILLS}
            selected={form.skills}
            onToggle={toggleSkill} />
          
          {errors.skills &&
          <p className="mt-1.5 text-xs text-signal-600">{errors.skills}</p>
          }
        </div>
      </div>
    </Modal>);

}