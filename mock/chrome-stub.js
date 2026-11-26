window.chrome = {
  runtime: {
    sendMessage() {
      return Promise.resolve({ ok: true, data: { channel: {}, global: {}, emoteSize: 48 } });
    },
  },
};
