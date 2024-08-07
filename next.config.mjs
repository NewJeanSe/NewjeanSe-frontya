const nextConfig = {
	reactStrictMode: true,
	experimental: {
		esmExternals: true, // ES 모듈 지원을 켭니다.
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
};

export default nextConfig;
