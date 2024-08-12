import { EventEmitter } from 'events';
import { MonitorWorkForceParams } from '../types';

// TODO: Add logic to deploy another worker
function handleScaleUp(){
    console.log('Scaling up')
}

// TODO: Add logic to terminate a worker
function handleScaleDown(){
    console.log('Scaling down')
}


export class QueueMonitor extends EventEmitter {
    constructor() {
        super();
    }
    manageScaleWorkers(workforce: MonitorWorkForceParams){
        const {queueSize, maxQueueSize, maxWorkers, currentWorkers} = workforce;
        const scaleUp = queueSize > maxQueueSize && currentWorkers < maxWorkers;
        const scaleDown = queueSize <= 0.5 * maxQueueSize && currentWorkers > 1;
    
        switch (true) {
            case scaleUp:
               handleScaleUp()
                break;
            case scaleDown:
                handleScaleDown()
                break;
            default:
                break;
        }
    
    } 
}
