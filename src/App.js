import './App.css';
import React from 'react';
import Dots from './Dots';

// Variables
const keys = ["C","-","%","/",7, 8, 9,"*", 4, 5, 6,"-", 1, 2, 3,"+",0,".","="];
const nums = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
const ops = ["/", "*", "-", "+","%"];
const ids = {
  "C":"clear",
  "%":"remainder",
  7: "seven",
  8: "eight",
  9: "nine",
  4: "four",
  5: "five",
  6: "six",
  1: "one",
  2: "two",
  3: "three",
  0: "zero",
  "/": "divide",
  "*": "multiply",
  "-": "subtract",
  "+": "add",
  ".": "decimal",
  "=": "equals"
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    lastPressed: undefined,
    display: "0",
    result:"0",
    operation: undefined,
    slide : "",
    history:[]
  };

  slide =()=>{
    const { slide }= this.state;
    if (slide === "") {      
      this.setState({
        slide:"slideDown"
      })
    }else{
      this.setState({
        slide:""
      })
    }
  }
  handleClick = (e) => {    
    console.log(this.state.history.length);
    const { display, lastPressed } = this.state;
    const { innerText } = e.target;
    switch (innerText) {
      case "C": {
        this.setState({
          display: "0",
          result: "0"
        });
        break;
      }
      case ".": {
        // Separate the string into pieces of string by operators
        const splitted = display.split(/[\+\-\*\/\%]/);
        // Filter out the last piece of the String 
        const last = splitted.slice(-1)[0];
        // If the last piece includes multiple "."s  then remove extra "."s 
        if (!last.includes(".")) {
          this.setState({
            display: display + "."
          });
        }
        break;
      }

      case "=": {
        const answer = eval(display);
        let arr = [];
        var obj = {};
        obj.eqtn = display;
        obj.ans = answer;
        arr.push(obj)
        this.setState({
          history: [...this.state.history, ...arr],
          display: answer,
          result: "0"
        });
        break;
      }
      default: {
        let e = undefined;
        // If current key is a operator
        if (ops.includes(innerText)) {
          // If lastpresed key is operator AND current key is not "-"
          if (ops.includes(lastPressed) && innerText !== "-") {
            const lastNumberIdx = display
            .split("") //Separating every single character in string
            .reverse() // Reversing the array return by above method
            .findIndex((char) => char !== " " && nums.includes(+char)); // Finding index of last character
            // if its not empty AND it STARTS with a number in the above Reversed array
            e =
            display.slice(0, display.length - lastNumberIdx) +
            ` ${innerText} `; // ****EXPLANATION NEEDED****
          } else {
            // Removing extra "-" after another operator
            if (lastPressed!== "-") {              
              e = `${display} ${innerText} `;
            }else{
              e = `${display}`
            }
          }
        } else {
          e = display === "0" ? innerText : display + innerText;
        }
        this.setState({
          display: e,
        });
        try {          
          const ans = eval(e);
          this.setState({
            result: ans
          });
        } catch (error) {
          // console.log(error);
        }
      }
    }
    this.setState({
      lastPressed: innerText
    });
  };


  render() {
    const { display,result,slide,history } = this.state;
    return (
      <>
        <div className="shapes" id="sqr"></div>
        <div className="shapes"  id="crcl"></div>
        <div className="shapes"  id="halfCrcl"></div>
        <div className="shapes"  id="rect"></div>
        <Dots id="upperDots" />
        <Dots id="lowerDots" />
        <div id="mainDiv">
          <div className="wrapperDiv" id = {`${slide}`}>
            <div id="upperDiv">
              <div className="history">
                {history.length===0?<div className='displays ansHis' >0</div>           
                  : history.map((e)=>([
                    <div className="displays equatnHis">{e.eqtn}</div >,
                    <div className='displays ansHis' >{e.ans}</div>                  
                  ]))}
              </div>
              <div className='displays' id="display">{display}</div>
              <div className='displays' id="result"> {result}</div>
            </div>
            <div id="lowerDiv">
              <div onClick={this.slide} id="slider1"></div>    
              <div onClick={this.slide} id="slider2"></div>    
              <div id="keyPad">
                {keys.map((num) => (
                  <button id={ids[num]} key={num} onClick={this.handleClick} className="keys">
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}


export default App;
