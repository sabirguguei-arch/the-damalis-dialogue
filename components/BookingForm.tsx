"use client";

import { FormEvent, useState } from "react";

type BookingCategory =
  | "Podcast guest"
  | "Brand collaboration or sponsorship"
  | "Event or speaking appearance"
  | "Media interview"
  | "Other";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  category: BookingCategory | "";
  preferredDate: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmissionStatus = "idle" | "opened" | "error";

const initialValues: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  category: "",
  preferredDate: "",
  message: "",
  consent: false,
};

const categories: BookingCategory[] = [
  "Podcast guest",
  "Brand collaboration or sponsorship",
  "Event or speaking appearance",
  "Media interview",
  "Other",
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.category) {
    errors.category = "Please choose a booking category.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Please share at least 20 characters about your request.";
  }

  if (!values.consent) {
    errors.consent = "Please confirm that you agree to the privacy notice.";
  }

  return errors;
}

export function BookingForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

  function updateValue<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionStatus("idle");
    setSubmissionMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionStatus("idle");
      setSubmissionMessage("");
      return;
    }

    const adminWhatsAppNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER;

    if (!adminWhatsAppNumber || !/^\d{8,15}$/.test(adminWhatsAppNumber)) {
      setSubmissionStatus("error");
      setSubmissionMessage(
        "WhatsApp is not configured yet. Set NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER in the project's .env.local file to the administrator's international number using digits only, including the country code.",
      );
      return;
    }

    const whatsappMessage = [
      "Hello, I would like to make a booking request for The Damalis Dialogue.",
      "",
      `Full name: ${values.fullName.trim()}`,
      `Email address: ${values.email.trim()}`,
      `Phone or WhatsApp number: ${values.phone.trim() || "Not provided"}`,
      `Booking category: ${values.category}`,
      `Preferred date: ${values.preferredDate || "Not specified"}`,
      "",
      "Message and relevant details:",
      values.message.trim(),
    ].join("\n");

    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (!whatsappWindow) {
      setSubmissionStatus("error");
      setSubmissionMessage(
        "WhatsApp could not be opened. Please allow pop-ups for this site and try again, or contact the administrator directly using the configured WhatsApp number.",
      );
      return;
    }

    setSubmissionStatus("opened");
    setSubmissionMessage(
      "WhatsApp should now be open with your request ready to review. Press Send in WhatsApp to deliver it. This request is not saved by the website and is not confirmed until the administrator replies.",
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="booking-form-grid">
        <div className="form-field">
          <label htmlFor="fullName">Full name <span aria-hidden="true">*</span></label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            required
          />
          {errors.fullName ? <p id="fullName-error" className="form-error">{errors.fullName}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email ? <p id="email-error" className="form-error">{errors.email}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone or WhatsApp number <span className="form-optional">(optional)</span></label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Booking category <span aria-hidden="true">*</span></label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={(event) => updateValue("category", event.target.value as FormValues["category"])}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          {errors.category ? <p id="category-error" className="form-error">{errors.category}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="preferredDate">Preferred date <span className="form-optional">(optional)</span></label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            value={values.preferredDate}
            onChange={(event) => updateValue("preferredDate", event.target.value)}
          />
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="message">Message and relevant details <span aria-hidden="true">*</span></label>
          <textarea
            id="message"
            name="message"
            rows={7}
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            required
          />
          {errors.message ? <p id="message-error" className="form-error">{errors.message}</p> : null}
        </div>
      </div>

      <div className="form-consent">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(event) => updateValue("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : "consent-note"}
          required
        />
        <div>
          <label htmlFor="consent">
            I agree that the information I provide may be reviewed for this booking request. <span aria-hidden="true">*</span>
          </label>
          <p id="consent-note">Your details are placed into the WhatsApp message only when you choose to continue. The website does not save your request.</p>
          {errors.consent ? <p id="consent-error" className="form-error">{errors.consent}</p> : null}
        </div>
      </div>

      <p className="form-required-note"><span aria-hidden="true">*</span> Required field</p>
      <p className="form-whatsapp-note">
        Submitting opens WhatsApp with a pre-filled message. You must press
        Send in WhatsApp to deliver your request. This is a request, not a
        confirmed booking.
      </p>
      {submissionStatus !== "idle" ? (
        <p
          className={`form-feedback form-feedback-${submissionStatus}`}
          role={submissionStatus === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {submissionMessage}
        </p>
      ) : null}
      <button className="button button-primary" type="submit">Continue to WhatsApp</button>
    </form>
  );
}
