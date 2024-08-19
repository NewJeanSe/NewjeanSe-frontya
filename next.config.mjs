// next.config.mjs
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
	rewrites: async () => {
		return [
			{
				source: '/api/:path*',
				destination: 'https://40aa-34-106-10-150.ngrok-free.app/:path*',
			},
		];
	},
};

export default withTM(nextConfig);
