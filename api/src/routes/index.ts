import express from 'express';
import chartAnalysisRoute from './analysis';
import authRoute from './auth'
import usageRoute from './usage'
import sharedAnalysisRoute from "./share"
import journalRoute from "./journal"
import webhooksRoute from "./webhooks";
import { Route } from '@src/types';

export function addRoutes(app: express.Application, routes: Route[]) {
    routes.forEach(route => {
        app.use(route.path, route.routeHandlers)
    })
}

export {
    chartAnalysisRoute,
    sharedAnalysisRoute,
    usageRoute,
    authRoute,
    journalRoute,
    webhooksRoute
}