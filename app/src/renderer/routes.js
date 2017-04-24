export default [
  {
    path: '/',
    name: 'loading',
    component: require('components/LoadingPage')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: require('components/DashboardPage')
  },
  {
    path: '/anime',
    name: 'anime',
    component: require('components/AnimePage'),
    children: [
      {
        path: '/list',
        name: 'anime-list',
        component: require('components/AnimeView/ListPage')
      },
      {
        path: '/new',
        name: 'anime-new',
        component: require('components/AnimeView/NewPage')
      },
      {
        path: '/option',
        name: 'anime-option',
        component: require('components/AnimeView/OptionPage')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    component: require('components/SettingPage')
  },
  {
    path: '*',
    redirect: '/'
  }
]
