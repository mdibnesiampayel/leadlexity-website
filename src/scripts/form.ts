type Brief = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  services: string[];
  budget: string;
  goals: string;
  preparedAt: string;
};
type Errors = Partial<
  Record<'fullName' | 'businessName' | 'email' | 'phone' | 'website' | 'goals' | 'services', string>
>;

function initializeLeadForm(form: HTMLFormElement) {
  const panel = document.querySelector<HTMLElement>('#strategy-call')!;
  const fields: Record<string, HTMLInputElement | HTMLTextAreaElement> = {
    fullName: form.querySelector<HTMLInputElement>('#full-name')!,
    businessName: form.querySelector<HTMLInputElement>('#business-name')!,
    email: form.querySelector<HTMLInputElement>('#email')!,
    phone: form.querySelector<HTMLInputElement>('#phone')!,
    website: form.querySelector<HTMLInputElement>('#website')!,
    goals: form.querySelector<HTMLTextAreaElement>('#goals')!,
  };
  const checkboxes = [...form.querySelectorAll<HTMLInputElement>('input[name="services"]')];
  const servicesFieldset = form.querySelector<HTMLFieldSetElement>('#services-fieldset')!;
  const errorSummary = form.querySelector<HTMLElement>('#form-errors')!;
  const errorList = form.querySelector<HTMLUListElement>('#form-error-list')!;
  const requestError = form.querySelector<HTMLElement>('#request-error')!;
  const submit = form.querySelector<HTMLButtonElement>('#submit-brief')!;
  const submitLabel = submit.querySelector('span')!;
  const result = panel.querySelector<HTMLElement>('#brief-result')!;
  const resultTitle = panel.querySelector<HTMLElement>('#brief-result-title')!;
  const resultMessage = panel.querySelector<HTMLElement>('#brief-result-message')!;
  const summary = panel.querySelector<HTMLDListElement>('#brief-summary')!;
  const actionStatus = panel.querySelector<HTMLElement>('#brief-action-status')!;
  const goalsCount = form.querySelector<HTMLElement>('#goals-count')!;
  let attempted = false;
  let busy = false;
  let currentBrief: Brief | null = null;
  let sent = false;

  const value = (key: string) => fields[key].value.trim();
  const selectedServices = () =>
    checkboxes.filter((input) => input.checked).map((input) => input.value);
  const normalizeWebsite = (raw: string) => {
    if (!raw) return '';
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      !url.hostname.includes('.') ||
      /\s/.test(raw) ||
      url.username ||
      url.password
    )
      throw new Error('Invalid website');
    return url.href;
  };

  function validate(): Errors {
    const errors: Errors = {};
    if (value('fullName').length < 2) errors.fullName = 'Please enter your full name.';
    if (value('businessName').length < 2) errors.businessName = 'Please enter your business name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')) || !fields.email.validity.valid)
      errors.email = 'Please enter a valid email address.';
    const phone = value('phone');
    if (phone && (!/^[+\d\s().-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7))
      errors.phone = 'Enter a valid phone number, including your country code.';
    try {
      normalizeWebsite(value('website'));
    } catch {
      errors.website = 'Enter a valid website address, or leave this optional field empty.';
    }
    if (!selectedServices().length) errors.services = 'Choose a service, or select Not Sure Yet.';
    if (value('goals').length < 15)
      errors.goals = 'Tell us a little more about your goals (at least 15 characters).';
    return errors;
  }

  function setError(key: string, message?: string) {
    const isServices = key === 'services';
    const field = isServices ? servicesFieldset : fields[key];
    const errorId = isServices ? 'services-error' : `${field.id}-error`;
    const errorElement = form.querySelector<HTMLElement>(`#${errorId}`)!;
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      errorElement.textContent = message;
      errorElement.hidden = false;
    } else {
      field.removeAttribute('aria-invalid');
      errorElement.textContent = '';
      errorElement.hidden = true;
    }
  }

  function renderSummary(errors: Errors) {
    errorList.replaceChildren();
    Object.entries(errors).forEach(([key, message]) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      const field = key === 'services' ? checkboxes[0] : fields[key];
      link.href = `#${field.id}`;
      link.textContent = message;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        field.focus();
      });
      li.append(link);
      errorList.append(li);
    });
    errorSummary.hidden = Object.keys(errors).length === 0;
  }

  function refreshField(key: string) {
    const errors = validate();
    setError(key, errors[key as keyof Errors]);
    if (attempted) renderSummary(errors);
  }

  Object.entries(fields).forEach(([key, input]) => {
    input.addEventListener('blur', () => {
      if (input.value.trim() || attempted) refreshField(key);
    });
    input.addEventListener('input', () => {
      if (key === 'goals') goalsCount.textContent = `${input.value.length} / 2500`;
      if (attempted || input.getAttribute('aria-invalid') === 'true') refreshField(key);
      requestError.hidden = true;
    });
  });
  checkboxes.forEach((input) =>
    input.addEventListener('change', () => {
      if (input.checked) {
        if (input.dataset.serviceId === 'not-sure')
          checkboxes.forEach((other) => {
            if (other !== input) other.checked = false;
          });
        else checkboxes.find((other) => other.dataset.serviceId === 'not-sure')!.checked = false;
      }
      if (attempted || servicesFieldset.hasAttribute('aria-invalid')) refreshField('services');
    }),
  );
  const requestedService = new URLSearchParams(location.search).get('service');
  if (requestedService) {
    const match = checkboxes.find((input) => input.dataset.serviceId === requestedService);
    if (match) match.checked = true;
  }

  function collectBrief(): Brief {
    return {
      fullName: value('fullName'),
      businessName: value('businessName'),
      email: value('email'),
      phone: value('phone'),
      website: normalizeWebsite(value('website')),
      businessType: form.querySelector<HTMLSelectElement>('#business-type')!.value,
      services: selectedServices(),
      budget: form.querySelector<HTMLSelectElement>('#budget')!.value,
      goals: value('goals'),
      preparedAt: new Date().toISOString(),
    };
  }

  function showBrief(brief: Brief, wasSent: boolean) {
    currentBrief = brief;
    sent = wasSent;
    resultTitle.textContent = sent ? 'Your enquiry has been sent.' : 'Your brief is ready.';
    resultMessage.textContent = sent
      ? 'Your enquiry has been received by the connected lead system. No call has been booked yet. You can keep a copy of your brief below.'
      : form.dataset.booking
        ? 'Your brief has not been sent, and no call has been booked. Keep a copy and open the live booking calendar to choose a time.'
        : 'Your brief has not been sent, and no call has been booked. Download it to keep your business goals in one place while live booking is being connected.';
    const entries: [string, string][] = [
      ['Name', brief.fullName],
      ['Business', brief.businessName],
      ['Email', brief.email],
      ['Phone', brief.phone || 'Not provided'],
      ['Website', brief.website || 'Not provided'],
      ['Business type', brief.businessType || 'Not specified'],
      ['Services', brief.services.join(', ')],
      ['Budget', brief.budget || 'Prefer to discuss'],
      ['Goals', brief.goals],
    ];
    summary.replaceChildren();
    entries.forEach(([label, content]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = content;
      row.append(dt, dd);
      summary.append(row);
    });
    form.hidden = true;
    result.hidden = false;
    actionStatus.textContent = '';
    result.focus({ preventScroll: true });
    panel.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    attempted = true;
    requestError.hidden = true;
    const errors = validate();
    [...Object.keys(fields), 'services'].forEach((key) =>
      setError(key, errors[key as keyof Errors]),
    );
    renderSummary(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      (firstError === 'services' ? checkboxes[0] : fields[firstError]).focus();
      return;
    }
    if (form.querySelector<HTMLInputElement>('#website-check')!.value) {
      requestError.textContent = 'Please review your details and try again.';
      requestError.hidden = false;
      return;
    }
    const brief = collectBrief();
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      showBrief(brief, false);
      return;
    }
    busy = true;
    submit.disabled = true;
    submitLabel.textContent = 'Sending your enquiry…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...brief, source: 'LeadLexity website', websiteCheck: '' }),
        signal: controller.signal,
      });
      const responseBody = await response.json();
      if (!response.ok || responseBody.ok !== true) throw new Error('Submission not accepted');
      showBrief(brief, true);
    } catch {
      requestError.textContent =
        'We couldn’t send your enquiry. Your details are still here. Please try again; nothing has been booked.';
      requestError.hidden = false;
      requestError.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } finally {
      window.clearTimeout(timeout);
      busy = false;
      submit.disabled = false;
      submitLabel.textContent = 'Book a Free Strategy Call';
      form.removeAttribute('aria-busy');
    }
  });

  function briefText() {
    if (!currentBrief) return '';
    const brief = currentBrief;
    return [
      'LEADLEXITY — PROJECT BRIEF',
      'Where Creativity Meets Conversion',
      '',
      `Prepared: ${brief.preparedAt}`,
      sent
        ? 'Status: Enquiry sent. A call has NOT been booked.'
        : 'Status: Prepared locally. NOT sent. A call has NOT been booked.',
      '',
      `Full name: ${brief.fullName}`,
      `Business name: ${brief.businessName}`,
      `Email: ${brief.email}`,
      `Phone / WhatsApp: ${brief.phone || 'Not provided'}`,
      `Website: ${brief.website || 'Not provided'}`,
      `Business type: ${brief.businessType || 'Not specified'}`,
      `Services: ${brief.services.join(', ')}`,
      `Monthly marketing budget (USD): ${brief.budget || 'Prefer to discuss'}`,
      '',
      'GOALS',
      brief.goals,
      '',
      'This is your project brief, not a booking confirmation.',
    ].join('\n');
  }

  panel.querySelector<HTMLButtonElement>('#download-brief')!.addEventListener('click', () => {
    if (!currentBrief) return;
    const url = URL.createObjectURL(new Blob([briefText()], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leadlexity-project-brief.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    actionStatus.textContent = 'Your brief download has started.';
  });
  panel.querySelector<HTMLButtonElement>('#copy-brief')!.addEventListener('click', async () => {
    if (!currentBrief) return;
    try {
      await navigator.clipboard.writeText(briefText());
      actionStatus.textContent = 'Brief copied to your clipboard.';
    } catch {
      actionStatus.textContent =
        'Clipboard access is unavailable. Please use Download brief instead.';
    }
  });
  panel.querySelector<HTMLButtonElement>('#edit-brief')!.addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    actionStatus.textContent = '';
    fields.fullName.focus();
  });
  // No personal data is saved to localStorage or sent in brief-only mode.
  // Enable only after the submit handler is installed, so a no-JS page cannot leak a brief.
  form.querySelector<HTMLFieldSetElement>('#project-fields')!.disabled = false;
}

const form = document.querySelector<HTMLFormElement>('#lead-form');
if (form) initializeLeadForm(form);
