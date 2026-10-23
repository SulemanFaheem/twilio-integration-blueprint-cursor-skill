export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.info(msg, meta);
    else console.info(msg);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.warn(msg, meta);
    else console.warn(msg);
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    if (meta) console.error(msg, meta);
    else console.error(msg);
  },
};
