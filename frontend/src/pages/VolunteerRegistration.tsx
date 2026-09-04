import React, { useState } from 'react';
import { CheckCircle2Icon, PencilIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { VolunteerFormModal } from '../components/volunteers/VolunteerFormModal';
import { Button } from '../components/shared/Button';
import { PageHeader } from '../components/shared/PageHeader';
import { createVolunteer } from '../services/volunteers';
import { Volunteer } from '../types/relief';
import { useReliefData } from '../contexts/ReliefDataContext';

export function VolunteerRegistration() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [registered, setRegistered] = useState(false);
  const { volunteers } = useReliefData();

  const submit = async (volunteer: Volunteer) => {
    try {
      if (editing) await volunteers.update(editing.id, volunteer);
      else await createVolunteer(volunteer);
      setFormOpen(false);
      setEditing(null);
      setRegistered(true);
      toast.success(editing ? 'Your volunteer details were updated.' : 'Your volunteer registration was submitted.');
    } catch {
      toast.error('Could not submit your registration. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeader
        title="Join the volunteer network"
        description="Share your skills and preferred district. Relief coordinators will use this roster when help is needed."
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <UsersIcon className="h-4 w-4" />
            Register as a volunteer
          </Button>
        }
      />

      {registered && (
        <section className="flex items-start gap-3 border border-brand-200 bg-brand-50 p-5 text-brand-800">
          <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Registration received</h2>
            <p className="mt-1 text-sm">Thank you. Your details are now available to the relief coordination team.</p>
          </div>
        </section>
      )}

      <section className="border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold text-ink">Your submissions</h2>
        {volunteers.items.length === 0 ?
        <p className="mt-3 text-sm text-ink-muted">You have not submitted volunteer details yet.</p> :
        <div className="mt-4 space-y-3">
          {volunteers.items.map((volunteer) =>
          <div key={volunteer.id} className="flex flex-col gap-3 border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-ink">{volunteer.name}</p>
              <p className="text-sm text-ink-muted">{volunteer.phone} · {volunteer.preferredDistrict} · {volunteer.skills.join(', ')}</p>
              <p className="mt-1 text-xs text-ink-faint">Status: {volunteer.availability}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(volunteer); setFormOpen(true); }}><PencilIcon className="h-3.5 w-3.5" />Edit</Button>
              <Button size="sm" variant="ghost" className="hover:text-signal-600" onClick={async () => { if (window.confirm('Delete your volunteer submission?')) { await volunteers.remove(volunteer.id); toast.success('Submission deleted.'); } }}><Trash2Icon className="h-3.5 w-3.5" />Delete</Button>
            </div>
          </div>)}
        </div>}
      </section>

      <section className="border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold text-ink">What we need from you</h2>
        <div className="mt-4 grid gap-4 text-sm text-ink-muted sm:grid-cols-3">
          <p><strong className="block text-ink">Your contact</strong>So coordinators can reach you quickly.</p>
          <p><strong className="block text-ink">Your skills</strong>Choose the work you can support.</p>
          <p><strong className="block text-ink">Your district</strong>Help can be coordinated locally.</p>
        </div>
      </section>

      <VolunteerFormModal
        open={formOpen}
        initial={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={submit}
      />
    </div>
  );
}
