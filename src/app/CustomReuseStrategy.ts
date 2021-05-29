import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

    handlers: { [key: string]: DetachedRouteHandle } = {};

    calcKey(route: ActivatedRouteSnapshot) {
        let next = route;
        let url = "";
        while (next) {
            if (next.url) {
                url = next.url.join('/');
            }
            next = next.firstChild;
        }
        return url;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // console.log('CustomReuseStrategy:shouldDetach', route);
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // console.log('CustomReuseStrategy:store', route, handle);
        let url = route.url.join("/") || route.parent.url.join("/");
        let calUrl = this.calcKey(route);
        url = calUrl != "" ? url + "/" + calUrl : url;
        this.handlers[url] = handle;

    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // console.log('CustomReuseStrategy:shouldAttach', route);
        let url = route.url.join("/") || route.parent.url.join("/");
        let calUrl = this.calcKey(route);
        url = calUrl != "" ? url + "/" + calUrl : url;
        return !!route.routeConfig && !!this.handlers[url];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        // console.log('CustomReuseStrategy:retrieve', route);
        let url = route.url.join("/") || route.parent.url.join("/");
        let calUrl = this.calcKey(route);
        url = calUrl != "" ? url + "/" + calUrl : url;
        if (!route.routeConfig) return null;
        return this.handlers[url];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // console.log('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return future.routeConfig === curr.routeConfig;
    }
}