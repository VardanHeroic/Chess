import React from "react"
import { store } from "./context.jsx"
import {Cell} from './cell.jsx'
import { Step } from './step.jsx';

export class King extends React.Component{
    constructor(props){
        super(props)
        this.isStart = props.isStart
        this.color = props.color
        this.x = props.x
        this.y = props.y
        this.isChosen = false
        this.freeCells = []
        this.attackedCells = []
    }

    static contextType = store

    changeCell(x,y,obj) {
        this.context.matrix[x][y] = obj 
    }

    killSteps(){
        this.context.matrix.map((row,i) => {
            row.map((cell,j) => {
                if(cell.props.fig && cell.props.fig.type.name == 'Step'){
                    let {x,y,color} = cell.props
                    this.changeCell(x,y,cell.props.fig.props.victim)
                }
            })
        })
    }


    findFreeCells(store,x,y,color){
        let ans = false
        let learnCheck = (x,y) => {
            for(let cell of store.checkDirections) {
                if(cell.props.x == x && cell.props.y == y){
                    console.log(cell,x,y,store.matrix);
                    ans = true
                    break
                }
                else{
                    ans = false
                }
            }
            return ans
        }
        let freeCells = []
        let directions = []
        let pseudoDirections = [
            {x:x-1,y:y-1},
            {x:x-1,y:y},
            {x:x-1,y:y+1},
            {x:x,y:y-1},
            {x:x,y:y+1},
            {x:x+1,y:y-1},
            {x:x+1,y:y},
            {x:x+1,y:y+1},
        ]
        let attackedCells = []

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                pseudoDirections.map(cord => {
                    if(cord.x == cellX && cord.y == cellY){
                        directions.push(cell)
                    }   
                })
            })
        })

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(cell.props.fig){
                    if(!(cell.props.fig.props.color == color) && directions.includes(cell) ){
                        attackedCells.push(cell)
                    }
                }   
            })
        })

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(color == 'black' && cellX == 1 && cellY == 5){ console.log(cell,!(learnCheck(cellX,cellY) ),cellY,store.checkDirections)}
                if(directions.includes(cell) && ( !cell.props.fig || attackedCells.includes(cell) ) && !(learnCheck(cellX,cellY) )) {
                    freeCells.push(cell)
                }
            })  
        })
        return {freeCells:freeCells,attackedCells:attackedCells}
    }

    move(){
        if(!this.isChosen && this.context.current == this.color ){
            this.killSteps()
            this.isChosen = true
            let currentRow = this.context.matrix.find((element,i) => i == this.x);
            let currentCell = currentRow.find((element,i) => i == this.y);
            let {x,y,color} = currentCell.props
            this.findFreeCells(this.context,this.x,this.y,this.color).freeCells.map((cell) =>{
                let newProps = cell.props
                this.changeCell(newProps.x,newProps.y,
                    <Cell 
                        x={newProps.x} 
                        y={newProps.y} 
                        color={newProps.color} 
                        key={newProps.x*10 + newProps.y} 
                        fig=<Step 
                            x={newProps.x} 
                            y={newProps.y} 
                            key={newProps.x*10 + newProps.y} 
                            fig=<Cell 
                                x={newProps.x} 
                                y={newProps.y} 
                                color={newProps.color} 
                                key={newProps.x*10 + newProps.y} 
                                fig=<King
                                    x={newProps.x} 
                                    y={newProps.y} 
                                    color={this.color}
                                    find={this.findFreeCells}
                                /> 
                            /> 
                            oldFig=<Cell 
                                x={x} 
                                y={y} 
                                color={color} 
                                key={x*10 + y} 
                            />
                            victim={cell} 
                        /> 
                    />
                )
            })
            
        }
        else{
            this.isChosen = false
            this.killSteps()
        }
       
    }

    render(){
        return <i className={this.color} onClick={() => this.move()} >l</i>
    }
}