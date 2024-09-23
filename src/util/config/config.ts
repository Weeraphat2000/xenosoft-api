type Config = {
  swagger: {
    enabled: boolean;
    title: string;
    description: string;
    version: string;
    path: string;
    servers: string[];
  };
};

const config: Config = {
  swagger: {
    enabled: true,
    title: 'xenosoft APIs',
    description: 'All endpoints for MenuX APIs',
    version: '1.0',
    path: 'api',
    servers: ['http://localhost:3000'],
  },
};

export default (): Config => config;
