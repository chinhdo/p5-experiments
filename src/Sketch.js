import React from 'react'
import p5 from 'p5'

class Sketch extends React.Component {
    constructor(props) {
        super(props)
        //p5 instance mode requires a reference on the DOM to mount the sketch
        //So we use react's createRef function to give p5 a reference
        this.myRef = React.createRef()
    }

    // This uses p5's instance mode for sketch creation and namespacing
    Sketch = (p) => {

        // Native p5 functions work as they would normally but prefixed with 
        // a p5 object "p"
        p.setup = () => {
            //Everyhting that normally happens in setup works
            p.createCanvas(this.myRef.current.clientWidth, this.myRef.current.clientHeight)
        }

        let theta;

        let x = 0;
        let goRight = true;

        p.draw = () => {
            if (goRight) {
                x++;
            }
            else {
                x--;
            }

            if (x > 700) {
                goRight = false;
            }

            if (x < 0) {
                goRight = true;
            }


            p.background("#222222");
            p.frameRate(30);
            p.stroke(255);


            // Let's pick an angle 0 to 90 degrees based on the mouse position
            // let a = (p.mouseX / p.width) * 90;

            let a = (x / p.width) * 90;

            let weight = 10;

            // Convert it to radians
            theta = p.radians(a);
            // Start the tree from the bottom of the screen
            p.translate(p.width / 2, p.height);
            // Draw a line 120 pixels
            p.strokeWeight(weight);
            p.line(0, 0, 0, -(p.height * .25));
            // Move to the end of that line
            p.translate(0, -(p.height * .25));
            // Start the recursive branching!
            branch(p.width / 4, weight);
        }

        function branch(h, w) {
            // Each branch will be 2/3rds the size of the previous one
            // h *= 0.66;
            h *= 0.66;

            // All recursive functions must have an exit condition!!!!
            // Here, ours is when the length of the branch is 2 pixels or less
            if (h > 2) {
                p.push();    // Save the current state of transformation (i.e. where are we now)
                p.rotate(theta);   // Rotate by theta
                p.strokeWeight(Math.max(1, w));
                p.line(0, 0, 0, -h);  // Draw the branch
                p.translate(0, -h); // Move to the end of the branch
                branch(h, w * 0.5);       // Ok, now call myself to draw two new branches!!
                p.pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state

                // Repeat the same thing, only branch off to the "left" this time!
                p.push();
                p.rotate(-theta);   // Rotate by theta
                p.strokeWeight(w);
                p.line(0, 0, 0, -h);
                p.translate(0, -h);
                branch(h, w * 0.5);
                p.pop();
            }
            else {
                // p.ellipse(0, 0, 2, 2);
            }
        }
    }

    componentDidMount() {
        //We create a new p5 object on component mount, feed it 
        this.myP5 = new p5(this.Sketch, this.myRef.current)
    }

    render() {
        return (
            //This div will contain our p5 sketch
            <div id="canvas" ref={this.myRef}>

            </div>
        )
    }
}

export default Sketch