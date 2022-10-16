const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

self.addEventListener('install', (event)=>{
    console.log('SW:instalado');

    //apertura o creación de un cache
    const respCache = caches.open(STATIC_CACHE_NAME).then((cache)=>{
        return cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            'images/icons/android-launchericon-144-144.png',
            'images/icons/android-launchericon-192-192.png',
            'images/icons/android-launchericon-512-512.png',
            'images/icons/android-launchericon-48-48.png',
            'images/icons/android-launchericon-72-72.png',
            'images/icons/android-launchericon-96-96.png',
            
        ]);
    });
    const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) =>{
        return cache.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
            'https://www.wallpapertip.com/wmimgs/42-424225_harry-potter-christmas-kung-fu-panda-more-arriving.jpg',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
        ])
    })

    event.waitUntil(Promise.all([respCache, respCacheInmutable]));

});

//Only cache
self.addEventListener('fetch', (event)=>{
    //busca el recurso solicitado en todos los caches
    const respCache = caches.match(event.request)
    event.respondWith(respCache); //responde al cache teniendo la respuesta que es repCache
})



//cache with network fallback
self.addEventListener('fetch', (event)=>{
    const resp = caches.match(event.request).then((respCache)=>{
    if(respCache){ //si no es undefine
        return respCache;
    }
    //Si no está en cache, entonces Web
    return fetch(event.request).then((respWeb)=>{
        caches.open(DYNAMIC_CACHE_NAME).then((cache)=>{ //se abre el cache dinámico y si no existe lo va a crear
            cache.put(event.request, respWeb) //es put porque no se conoce el contenido ni la url
        })
        return respWeb.clone();// es el return del then. El clon se usa para que no se use la misma referencia porque arriba se quiere responder con una mismo respond. Es un request y un respond
    })
})
event.respondWith(resp); //retorna la const resp del inicio
})
