
if ('{namespace}') {
    if (typeof window['{namespace}'] === 'undefined') {
        window['{namespace}'] = {}; 
    }    
    window['{namespace}']['{function-name}'] = WAF.proxy.ProxyFactory.createSyncFunc ('{function-name}', '{modulePath}');
    window['{namespace}']['{function-name}Async'] = WAF.proxy.ProxyFactory.createAsyncFunc ('{function-name}', '{modulePath}');
} else {
    window['{function-name}'] = WAF.proxy.ProxyFactory.createSyncFunc ('{function-name}', '{modulePath}');
    window['{function-name}Async'] = WAF.proxy.ProxyFactory.createAsyncFunc ('{function-name}', '{modulePath}');
}