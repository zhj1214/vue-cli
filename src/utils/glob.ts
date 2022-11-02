export const ENV = import.meta.env.VITE_APP_ENV

/**
 * 各环境feconfig请求域名
 */
export const DOMAIN_URL = {
  dev: 'https://jetour-dev.obs.cn-east-3.myhuaweicloud.com',
  sit: 'https://jetour-sit.obs.cn-east-3.myhuaweicloud.com',
  uat: 'https://vr-jetour-uat.jetour.com.cn',
  prod: 'https://vr-jetour.jetour.com.cn'
}

console.log('ENVENVENVENVENV',ENV);

export const DOMAINURL = DOMAIN_URL[ENV as EnvInfo]
