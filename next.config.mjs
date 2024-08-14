import transpileModules from 'next-transpile-modules';

const withTM = transpileModules(['recharts']);

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		esmExternals: true,
	},
	webpack: config => {
		config.module.rules.push({
			test: /\.m?js$/,
			resolve: {
				fullySpecified: false,
			},
		});
		return config;
	},
	images: {
		domains: ['localhost'], // 외부 이미지 호스트 허용
	},
};

export default withTM(nextConfig);
