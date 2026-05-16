// ───────────────────────────────────────────────
// Staylocalx Job Builder v2 — reads registry from GitHub
// Auto-detects format (single vs carousel) per target
// ───────────────────────────────────────────────

const REGISTRY = $input.first().json;

const command = $('Telegram Trigger').item.json.message.text.trim();
const chatId = $('Telegram Trigger').item.json.message.chat.id;

const content = REGISTRY[command];
if (!content) {
  const known = Object.keys(REGISTRY).filter(k => !k.startsWith('_')).join(', ');
  throw new Error(`Comando desconocido: "${command}". Disponibles: ${known}`);
}

const jobs = content.targets.map(t => {
  const images = t.images || content.images;
  // Auto-detect format. Single image = single post. >=2 = carousel.
  // Allow explicit override via target.format or content.format.
  const explicit = t.format || content.format;
  const format = explicit || (images.length === 1 ? 'single' : 'carousel');

  return {
    instagram_account_id: t.ig_id,
    account_name: t.name,
    caption: t.caption || content.caption,
    images: images,
    format: format
  };
});

return [{
  json: { command, chat_id: chatId, jobs }
}];
