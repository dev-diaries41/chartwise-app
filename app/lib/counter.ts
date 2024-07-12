export class Counter {
    maxCount: number;
    count: number ;


    constructor(maxCount: number){
        this.maxCount = maxCount;
        this.count = 0;
    }
    
    increment(){
        if(this.isMax())return
        this.count++;
    }

    decrement(){
        this.count--;
    }
    reset(){
        this.count = 0
    }

    isMax(){
        return this.count >= this.maxCount;
    }
}