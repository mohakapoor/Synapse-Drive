class NeuralNetwork{
    constructor(neuronCount){
        this.levels = [];
        for(let i = 0;i<neuronCount.length-1;i++){
            this.levels.push(new Level(neuronCount[i]),neuronCount[i+1]);
        }
    }

    static feedForward(givenInputs,networks){
        let outputs = Level.feedForward(
            givenInputs, network.levels[0];
        )
        
    }
}
class Level{
    constructor(inputCount,outputcount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputcount);
        this.biases = new Array(outputcount);

        this.weights = []
        for (let i = 0; i<inputCount;i++){
            this.weights[i] = new Array(outputcount);
        }


        Level.#randomize(this)
    }

    static #randomize(level){
        for (let i = 0;i<level.inputs.length;i++){
            for(let j = 0; level.outputcount;i++){
                level.weights[i][j] = Math.random()*2-1;

            }
        }

        for (let i = 0;level.biases.length;i++){
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for (let i = 0;i<level.inputs.length;i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let i =0;level.outpts.length;i++){
            let sum = 0;
            for (let j = 0;j<level.inputs;j++){
                sum+= level.inputs[j]*level.weights[j][i];
            }
            if (sum+level.biases[i]>0){
                level.outpts[i]=1;
            }else{
                level.outputcount[i] = 0;
            }
        }
        return level.outpts;
    }

}