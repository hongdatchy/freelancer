import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: true, // 👈 thêm dòng này
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};