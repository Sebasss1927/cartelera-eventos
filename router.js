function handleRouting() {
  const hash = location.hash.slice(1);
  if (hash.startsWith('event/')) {
    const id = hash.split('/')[1];
    renderDetail(id);
  } else {
    renderEvents(allEvents);
  }
}
