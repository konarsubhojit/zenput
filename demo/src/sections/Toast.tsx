import { useRef, useState } from 'react';
import { ToastProvider, useToast } from 'zenput';
import type { ToastPlacement, ToastStatus } from 'zenput';
import { Section, Scenario } from './_shell';

// ---------------------------------------------------------------------------
// Inner components — must live inside <ToastProvider>
// ---------------------------------------------------------------------------

function AllStatusButtons() {
  const toast = useToast();
  const statuses: ToastStatus[] = ['info', 'success', 'warning', 'error', 'loading'];
  return (
    <div className="row">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() =>
            toast.show({
              status,
              title: `${status.charAt(0).toUpperCase() + status.slice(1)}`,
              description: `This is a ${status} notification.`,
              duration: status === 'loading' ? null : 5000,
            })
          }
          style={{ textTransform: 'capitalize' }}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

function WithDescriptionButton() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast.show({
          status: 'success',
          title: 'Profile saved',
          description: 'Your changes have been published and are now live.',
        })
      }
    >
      Show with description
    </button>
  );
}

function WithActionButton() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast.show({
          status: 'success',
          title: 'Item deleted',
          action: {
            label: 'Undo',
            onClick: () => toast.show({ status: 'info', title: 'Deletion undone' }),
          },
        })
      }
    >
      Show with action
    </button>
  );
}

function PromiseButton() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    if (busy) return;
    setBusy(true);
    const p = new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.4
          ? resolve({ name: 'report.csv' })
          : reject(new Error('Network timeout'));
        setBusy(false);
      }, 2000);
    });
    toast
      .promise(p, {
        loading: 'Saving your changes…',
        success: (data) => `Saved ${data.name} successfully!`,
        error: (err) => `Failed: ${(err as Error).message}`,
      })
      .catch(() => {});
  };

  return (
    <button type="button" onClick={handleClick} disabled={busy}>
      {busy ? 'Saving…' : 'Save (random success/fail)'}
    </button>
  );
}

function StackingButtons() {
  const toast = useToast();
  return (
    <div className="row">
      <button
        type="button"
        onClick={() => {
          toast.show({ status: 'info', title: 'First notification' });
          setTimeout(() => toast.show({ status: 'success', title: 'Second notification' }), 400);
          setTimeout(() => toast.show({ status: 'warning', title: 'Third notification' }), 800);
        }}
      >
        Stack 3 toasts
      </button>
      <button type="button" onClick={() => toast.dismiss()}>
        Dismiss all
      </button>
    </div>
  );
}

function PersistentButtons() {
  const toast = useToast();
  const idRef = useRef<string>('');
  return (
    <div className="row">
      <button
        type="button"
        onClick={() => {
          idRef.current = toast.show({
            status: 'info',
            title: 'Persistent toast',
            description: 'Will not auto-dismiss. Use the button on the right.',
            duration: null,
          });
        }}
      >
        Show persistent
      </button>
      <button type="button" onClick={() => toast.dismiss(idRef.current)}>
        Dismiss by ID
      </button>
    </div>
  );
}

function PlacementButtons({ placement }: { placement: ToastPlacement }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast.show({ status: 'info', title: placement, duration: 3000 })}
      style={{ fontSize: 12 }}
    >
      {placement}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function ToastSection() {
  return (
    // Wrap the entire section so all inner components share one provider
    <ToastProvider placement="bottom-right" max={5} duration={5000}>
      <Section
        id="toast"
        name="Toast / Notifications"
        description="Imperative toast notifications via ToastProvider + useToast. Supports 5 statuses, promise tracking, action buttons, stacking, and 9 placement options."
      >
        <Scenario title="All statuses">
          <AllStatusButtons />
        </Scenario>

        <Scenario title="With description">
          <WithDescriptionButton />
        </Scenario>

        <Scenario title="With action button">
          <WithActionButton />
        </Scenario>

        <Scenario title="Promise helper (random success / fail)">
          <PromiseButton />
        </Scenario>

        <Scenario title="Stacking & dismiss all">
          <StackingButtons />
        </Scenario>

        <Scenario title="Persistent (duration: null)">
          <PersistentButtons />
        </Scenario>

        <Scenario title="Placements (each opens its own toast)">
          <div className="row" style={{ flexWrap: 'wrap' }}>
            {(
              [
                'top-left',
                'top-center',
                'top-right',
                'middle-left',
                'middle-center',
                'middle-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
              ] as ToastPlacement[]
            ).map((p) => (
              <ToastProvider key={p} placement={p} duration={3000}>
                <PlacementButtons placement={p} />
              </ToastProvider>
            ))}
          </div>
        </Scenario>
      </Section>
    </ToastProvider>
  );
}
