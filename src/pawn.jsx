import React from "react"
import { store } from "./context.jsx"
import {Cell} from './cell.jsx'
import { Step } from './step.jsx';

export class Pawn extends React.Component{
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
        let freeCells = []
        let moveDirections = []
        let directions = []
        let blockCells = []
        let attackDirections = []
        let attackedCells = []
        let blockXmin = -1
        let blockXmax = 8
        let blockYmin = -1
        let blockYmax = 8

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(color == 'white'){
                    if(cellX == x-1 && y == cellY ){
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if(cellX == x-2 && y == cellY && this.isStart ){
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if(cellX == x-1 && (y+1 == cellY || y-1 == cellY)){
                        attackDirections.push(cell)
                        directions.push(cell)
                    }
                    
                }
                else{
                    if(cellX == x+1 && y == cellY ){
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if(cellX == x+2 && y == cellY && this.isStart ){
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if(cellX == x+1 && (y+1 == cellY || y-1 == cellY)){
                        attackDirections.push(cell)
                        directions.push(cell)
                    }
                    
                }
               
                if(moveDirections.includes(cell)){
                    if (cell.props.fig) {
                        blockCells.push(cell)
                    }
                    blockCells.map(cell => {
                        if(blockXmin < cell.props.x && cell.props.x < x){
                            blockXmin = cell.props.x-1
                        }
                        if(blockXmax > cell.props.x && cell.props.x > x){
                            blockXmax = cell.props.x+1
                        }
                        if(blockYmin < cell.props.y && cell.props.y < y){
                            blockYmin = cell.props.y-1
                        }
                        if(blockYmax > cell.props.y && cell.props.y > y){
                            blockYmax = cell.props.y+1
                        }
                    })
                }
            })
        })

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(cell.props.fig && cell.props.fig.type.name != 'Step'){
                    if(!(cell.props.fig.props.color == color) && attackDirections.includes(cell) ){
                        attackedCells.push(cell)
                    }
                }   
            })
        })

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(!(store.isChecked && store.current == color ) && (cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && ((moveDirections.includes(cell) && !cell.props.fig ) || attackedCells.includes(cell) )  ) {
                    freeCells.push(cell)
                }
            })  
        })
        // console.log(freeCells);
        return {freeCells:freeCells,attackedCells:attackedCells,attackDirections:attackDirections}
    }

    componentWillUpdate(){
        this.freeCells = this.findFreeCells(this.context,this.x,this.y,this.color).freeCells
        this.attackedCells = this.findFreeCells(this.context,this.x,this.y,this.color).attackedCells
    }

    move(){
        if(!this.isChosen && this.context.current == this.color ){
            this.killSteps()
            this.isChosen = true
            let currentRow = this.context.matrix.find((element,i) => i == this.x);
            let currentCell = currentRow.find((element,i) => i == this.y);
            let {x,y,color} = currentCell.props
            this.freeCells.map((cell) =>{
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
                                fig=<Pawn 
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
        return <i className={this.color} onClick={() => this.move()} >o</i>
    }
}