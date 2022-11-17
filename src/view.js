import onChange from 'on-change';

const RSSLoaded = 'RSS успешно загружен';

export default (state, elements) => onChange(state, () => {
  const { form, input, feedback } = elements;

  if (state.form.valid === 'false') {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = state.form.error;
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  feedback.textContent = RSSLoaded;
  feedback.classList.add('text-success');

  form.reset();
  input.focus();
});
