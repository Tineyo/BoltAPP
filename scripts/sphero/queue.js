/* The objective of this queue is to send packets in turns to avoid GATT error */

class Queue{
	constructor(){
		this.running = false;
		this.tasks = [];
	}

	runCommand(data){
		this.running = true;
		bolt.write(data, _ => {
			this.running = false;
			if (this.tasks.length > 0)
			{
				this.runCommand(this.tasks.shift());
			}
		})
	}

	enqueueCommand(data){
		this.tasks.push(data);
	}

	queue (data){
		!this.running ? this.runCommand(data) : this.enqueueCommand(data);
	}
}


//BETTER QUEUE to improve.
//https://jsbin.com/xotepuzani/5/edit?js,console
/*
class Queue{
  constructor(fct){
    this.commands = [];
    this.fct = fct;
  }
  
  async queue(data){
    return new Promise(async (success, reject) => {
    	this.commands.push({
	        success,
	        reject,
	        data,
	    });
   		await this.processCommand();
    })
  }
  
  	async processCommand(){
	    const command = this.commands.shift();
	    if (command){
            await this.fct(command.data);
            command.success();
	    }
	}
}*/