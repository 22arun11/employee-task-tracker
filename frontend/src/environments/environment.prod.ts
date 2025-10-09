export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any)['env'] && (window as any)['env']['API_URL']) 
    ? (window as any)['env']['API_URL'] 
    : 'https://tasktracker-backend-route-22arun11-dev.apps.rm2.thpm.p1.openshiftapps.com/api'
};