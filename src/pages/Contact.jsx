import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend yet — this just confirms the UI works end to end.
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Contact
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Get in touch.</h1>
      <p className="mt-4 text-sm text-bone-dim">
        Questions about sizing, an order, or just want to say hello.
      </p>

      {submitted ? (
        <div className="mt-10 border border-brass/40 bg-brass/10 px-6 py-8">
          <p className="font-display text-xl text-bone">Message sent.</p>
          <p className="mt-2 text-sm text-bone-dim">
            This is a demo form, so nothing was actually delivered &mdash; but
            that's exactly what a real confirmation state would look like.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <Field label="Name" id="name" type="text" required />
          <Field label="Email" id="email" type="email" required />
          <div>
            <label
              htmlFor="message"
              className="font-mono text-xs uppercase tracking-widest text-bone-dim/60"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
            />
          </div>
          <button
            type="submit"
            className="mt-2 self-start border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, id, type, required }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-bone-dim/60"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
      />
    </div>
  );
}
