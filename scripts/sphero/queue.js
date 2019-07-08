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
