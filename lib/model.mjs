export function selectedModel() {
  const value = process.env.ISSUEDESK_MODEL;
  if (!value || value.indexOf('/') < 1 || value.endsWith('/')) {
    throw new Error('Set ISSUEDESK_MODEL to an available provider/model before --execute');
  }
  const slash = value.indexOf('/');
  return {providerID: value.slice(0, slash), id: value.slice(slash + 1)};
}

