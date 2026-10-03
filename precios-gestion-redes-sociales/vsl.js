document.querySelectorAll('[data-vsl-src]').forEach((shell) => {
  const launch = shell.querySelector('.vsl-launch');
  const source = shell.getAttribute('data-vsl-src');
  if (!launch || !source) return;

  launch.addEventListener('click', () => {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.tabIndex = 0;
    video.setAttribute('aria-label', 'Explicación de los planes Starter, Growth y Scale');
    video.src = source;

    const error = document.createElement('p');
    error.className = 'vsl-error';
    error.setAttribute('role', 'status');
    error.textContent = 'No se ha podido cargar el vídeo. Prueba de nuevo más tarde.';
    error.hidden = true;
    video.addEventListener('error', () => { error.hidden = false; });

    shell.replaceChildren(video, error);
    video.focus({ preventScroll: true });
    const playback = video.play();
    if (playback) playback.catch(() => {});
  }, { once: true });
});
