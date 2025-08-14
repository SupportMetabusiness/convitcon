export interface TrackingConfig {
    facebook?: {
        pixelId: string;
        enabled: boolean;
    };
    google?: {
        gtag: string;
        enabled: boolean;
    };
    tiktok?: {
        pixelId: string;
        enabled: boolean;
    };
    snapchat?: {
        pixelId: string;
        enabled: boolean;
    };
    twitter?: {
        pixelId: string;
        enabled: boolean;
    };
}

export interface TrackingEvent {
    name: string;
    parameters?: Record<string, any>;
    value?: number;
    currency?: string;
}

const defaultConfig: TrackingConfig = {
    facebook: {
        pixelId: '',
        enabled: false
    },
    google: {
        gtag: '',
        enabled: false
    },
    tiktok: {
        pixelId: '',
        enabled: false
    },
    snapchat: {
        pixelId: '',
        enabled: false
    },
    twitter: {
        pixelId: '',
        enabled: false
    }
};

export const useTracking = () => {
    const config = ref<TrackingConfig>(defaultConfig);

    // Load config from localStorage or API
    const loadConfig = async () => {
        if (process.client) {
            try {
                const stored = localStorage.getItem('tracking-config');
                if (stored) {
                    config.value = { ...defaultConfig, ...JSON.parse(stored) };
                }

                // Also try to load from admin API
                try {
                    const response = (await $fetch('/api/admin/tracking', {
                        method: 'GET'
                    })) as any;

                    if (response && response.success && response.data) {
                        config.value = { ...config.value, ...response.data };
                    }
                } catch (error) {
                    console.warn('Could not load tracking config from admin API:', error);
                }
            } catch (error) {
                console.warn('Could not load tracking config:', error);
            }
        }
    };

    // Save config
    const saveConfig = async (newConfig: Partial<TrackingConfig>) => {
        config.value = { ...config.value, ...newConfig };

        if (process.client) {
            localStorage.setItem('tracking-config', JSON.stringify(config.value));
        }

        // Save to admin API
        try {
            await $fetch('/api/admin/tracking', {
                method: 'POST',
                body: { config: config.value }
            });
        } catch (error) {
            console.warn('Could not save tracking config to server:', error);
        }
    };

    // Initialize tracking scripts
    const initializeTracking = () => {
        if (!process.client) return;

        // Facebook Pixel
        if (config.value.facebook?.enabled && config.value.facebook?.pixelId) {
            initFacebookPixel(config.value.facebook.pixelId);
        }

        // Google Analytics
        if (config.value.google?.enabled && config.value.google?.gtag) {
            initGoogleAnalytics(config.value.google.gtag);
        }

        // TikTok Pixel
        if (config.value.tiktok?.enabled && config.value.tiktok?.pixelId) {
            initTikTokPixel(config.value.tiktok.pixelId);
        }

        // Snapchat Pixel
        if (config.value.snapchat?.enabled && config.value.snapchat?.pixelId) {
            initSnapchatPixel(config.value.snapchat.pixelId);
        }

        // Twitter Pixel
        if (config.value.twitter?.enabled && config.value.twitter?.pixelId) {
            initTwitterPixel(config.value.twitter.pixelId);
        }
    };

    // Facebook Pixel
    const initFacebookPixel = (pixelId: string) => {
        if ((window as any).fbq) return;

        const script = document.createElement('script');
        script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(script);

        // Add noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
    };

    // Google Analytics
    const initGoogleAnalytics = (gtagId: string) => {
        if ((window as any).gtag) return;

        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}');
        `;
        document.head.appendChild(script2);
    };

    // TikTok Pixel
    const initTikTokPixel = (pixelId: string) => {
        if ((window as any).ttq) return;

        const script = document.createElement('script');
        script.innerHTML = `
            !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${pixelId}');
                ttq.page();
            }(window, document, 'ttq');
        `;
        document.head.appendChild(script);
    };

    // Snapchat Pixel
    const initSnapchatPixel = (pixelId: string) => {
        if ((window as any).snaptr) return;

        const script = document.createElement('script');
        script.innerHTML = `
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${pixelId}', {
                'user_email': '__INSERT_USER_EMAIL__'
            });
            snaptr('track', 'PAGE_VIEW');
        `;
        document.head.appendChild(script);
    };

    // Twitter Pixel
    const initTwitterPixel = (pixelId: string) => {
        if ((window as any).twq) return;

        const script = document.createElement('script');
        script.innerHTML = `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('init','${pixelId}');
            twq('track','PageView');
        `;
        document.head.appendChild(script);
    };

    // Track custom events
    const trackEvent = (event: TrackingEvent) => {
        if (!process.client) return;

        const { name, parameters = {}, value, currency = 'EUR' } = event;

        // Facebook Pixel
        if (config.value.facebook?.enabled && (window as any).fbq) {
            const fbParams = { ...parameters };
            if (value) {
                fbParams.value = value;
                fbParams.currency = currency;
            }
            (window as any).fbq('track', name, fbParams);
        }

        // Google Analytics
        if (config.value.google?.enabled && (window as any).gtag) {
            const gtagParams = { ...parameters };
            if (value) {
                gtagParams.value = value;
                gtagParams.currency = currency;
            }
            (window as any).gtag('event', name, gtagParams);
        }

        // TikTok Pixel
        if (config.value.tiktok?.enabled && (window as any).ttq) {
            const ttqParams = { ...parameters };
            if (value) {
                ttqParams.value = value;
                ttqParams.currency = currency;
            }
            (window as any).ttq.track(name, ttqParams);
        }

        // Snapchat Pixel
        if (config.value.snapchat?.enabled && (window as any).snaptr) {
            const snapParams = { ...parameters };
            if (value) {
                snapParams.price = value;
                snapParams.currency = currency;
            }
            (window as any).snaptr('track', name.toUpperCase(), snapParams);
        }

        // Twitter Pixel
        if (config.value.twitter?.enabled && (window as any).twq) {
            const twitterParams = { ...parameters };
            if (value) {
                twitterParams.value = value;
                twitterParams.currency = currency;
            }
            (window as any).twq('track', name, twitterParams);
        }
    };

    // Common ecommerce events
    const trackPageView = (page?: string) => {
        trackEvent({
            name: 'PageView',
            parameters: page ? { page_title: page } : {}
        });
    };

    const trackPurchase = (orderValue: number, orderId: string, items: any[] = []) => {
        trackEvent({
            name: 'Purchase',
            value: orderValue,
            parameters: {
                transaction_id: orderId,
                items: items
            }
        });
    };

    const trackAddToCart = (item: any, value?: number) => {
        trackEvent({
            name: 'AddToCart',
            value: value || item.price,
            parameters: {
                content_name: item.name,
                content_ids: [item.id],
                content_type: 'product'
            }
        });
    };

    const trackInitiateCheckout = (value: number, items: any[] = []) => {
        trackEvent({
            name: 'InitiateCheckout',
            value: value,
            parameters: {
                num_items: items.length,
                items: items
            }
        });
    };

    const trackViewContent = (item: any) => {
        trackEvent({
            name: 'ViewContent',
            value: item.price,
            parameters: {
                content_name: item.name,
                content_ids: [item.id],
                content_type: 'product'
            }
        });
    };

    return {
        config: readonly(config),
        loadConfig,
        saveConfig,
        initializeTracking,
        trackEvent,
        trackPageView,
        trackPurchase,
        trackAddToCart,
        trackInitiateCheckout,
        trackViewContent
    };
};
