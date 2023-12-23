
// 配置信息
const CONFIG = {
    development: {
        baseUrl: 'http://localhost:80',
        logo: 'http://localhost:8080/icon.jpeg',
        avatar: 'http://localhost:8080/header4.gif',
        emptyImg: 'http://localhost:8080/empty.png',
        // qrCodeUrlPrefix: 'http://localhost:8080?target=',
      },
      production: {
        baseUrl: 'https://121.37.9.218:8500',
        logo: 'https://121.37.9.218/logo.png',
        avatar: 'https://121.37.9.218/header1.gif',
        emptyImg: 'https://121.37.9.218/empty.png',
      }
}

export default CONFIG[process.env.NODE_ENV];
