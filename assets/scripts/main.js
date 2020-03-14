let canvas = document.querySelector('canvas');

let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let eyes =  [];
let theta;
let mouse = {
    x : undefined,
    y : undefined
}


function getMousePosition(event) {
    mouse.x = event.x;
    mouse.y = event.y;

}

function Eye(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.draw = function() {
        
        // draw eye
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
        let pupil_radius = this.radius / 2.5;
        
        // draw iris

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        theta = Math.atan2(dy,dx);

        

        
        let iris_x = this.x + Math.cos(theta) * this.radius/10;
        let iris_y = this.y + Math.sin(theta) * this.radius/10;
        let iris_radius = this.radius / 1.2;

        
        ctx.beginPath();
        
        if(Math.abs(dx) <= pupil_radius && Math.abs(dy) <= pupil_radius) {
            iris_x = this.x;
            iris_y = this.y;
            pupil_radius -= 0.5;
        } else {
            pupil_radius = this.radius / 2.5;
        }

        
        ctx.arc(iris_x,iris_y,iris_radius,0, Math.PI * 2, false);

        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

        // draw pupil

        let pupil_x = this.x + Math.cos(theta) * this.radius/1.9;
        let pupil_y = this.y + Math.sin(theta) * this.radius/1.9;
       

       

        ctx.beginPath();


        if(Math.abs(dx) <= pupil_radius && Math.abs(dy) <= pupil_radius) {
            pupil_x = this.x;
            pupil_y = this.y;
            pupil_radius -= 0.5; 
        } else {
            pupil_radius = this.radius/2.5;
        }

        ctx.arc(pupil_x,pupil_y,pupil_radius,0, Math.PI * 2, false);

        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();


        // draw pupil reflecttion

        // draw mouse
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2, false);
        ctx.fillStyle = "gold";
        ctx.fill();
        ctx.closePath();
    }
}

let overlapping = false;

function initialize() {
    eyes = [];
    let numberOfEyes = 200;
    let protecttion = 10000;
    let counter = 0;

    while(eyes.length < numberOfEyes && counter < protecttion) {
        let eye = {
            x : Math.floor(Math.random() * innerWidth),
            y : Math.floor(Math.random() * innerHeight),
            radius : Math.floor(Math.random() * 100) + 5
        }
        overlapping = false;
        for(let i = 0; i < eyes.length; i++) {
            let prev = eyes[i];
            
            let dx = (eye.x - prev.x);
            let dy = (eye.y - prev.y);
            let distance = Math.sqrt((dx**2) + (dy**2));

            if(distance < eye.radius + prev.radius) {
                overlapping = true;
                break;
            }

            
            
        }
        if(!overlapping) {
            eyes.push(new Eye(eye.x, eye.y, eye.radius));
        } else {
            counter++;
        }
    }
     

}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < eyes.length; i++) {
        eyes[i].draw();
    }
    
}
initialize();
animate();

function resizeCanvas(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initialize(); 
}

window.addEventListener('mousemove',getMousePosition);

window.addEventListener('resize', resizeCanvas);