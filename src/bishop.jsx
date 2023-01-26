import React from "react"
import { store } from "./context.jsx"
import {Cell} from './cell.jsx'
import { Step } from './step.jsx';

export class Bishop extends React.Component{
    constructor(props){
        super(props)
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
        let directions = []
        let blockCells = []
        let attackedCells = []
        let blockTL = {x:-1, y:-1}
        let blockTR = {x:-1, y:8}
        let blockBL = {x:8, y:-1}
        let blockBR = {x:8, y:8}

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                for(let n = 0; n < 8;n++){
                    if(y + n == cellY && x + n == cellX && y != cellY && x  != cellX){
                        directions.push(cell)
                        if (cell.props.fig) {
                            blockCells.push(cell)
                        }
                    }
                    if(y - n == cellY && x + n == cellX && y != cellY && x  != cellX){
                        directions.push(cell)
                        if (cell.props.fig) {
                            blockCells.push(cell)
                        }
                    }
                    if(y + n == cellY && x - n == cellX && y != cellY && x  != cellX){
                        directions.push(cell)
                        if (cell.props.fig) {
                        blockCells.push(cell)
                    }
                    }
                    if(y - n == cellY && x - n == cellX && y != cellY && x  != cellX){
                        directions.push(cell)
                        if (cell.props.fig) {
                            blockCells.push(cell)
                        }
                    }
                }
                blockCells.map(cell => {
                    if((blockTL.x < cell.props.x && cell.props.x < x) && (blockTL.y < cell.props.y && cell.props.y < y)){
                        blockTL.x = cell.props.x
                        blockTL.y = cell.props.y
                    }
                    if((blockBR.x > cell.props.x && cell.props.x > x) && (blockBR.y > cell.props.y && cell.props.y > y)){
                        blockBR.x = cell.props.x
                        blockBR.y = cell.props.y
                    }
                    if((blockTR.x < cell.props.x && cell.props.x < x) && (blockTR.y > cell.props.y && cell.props.y > y)){
                        blockTR.x = cell.props.x
                        blockTR.y = cell.props.y
                    }
                    if((blockBL.x > cell.props.x && cell.props.x > x) && (blockBL.y < cell.props.y && cell.props.y < y)){
                        blockBL.x = cell.props.x
                        blockBL.y = cell.props.y
                    }
                })
            })
        })

        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(cell.props.fig && cell.props.fig.type.name != 'Step'){
                    if(!(cell.props.fig.props.color == color) && directions.includes(cell) ){
                        if( (cellX < x && cellY < y) && (cellX >= blockTL.x && cellY >= blockTL.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX > x && cellY > y) && (cellX <= blockBR.x && cellY <= blockBR.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX < x && cellY > y) && (cellX >= blockTR.x && cellY <= blockTR.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX > x && cellY < y) && (cellX <= blockBL.x && cellY >= blockBL.y) ){
                            attackedCells.push(cell)
                        }
                    }
                }   
            })
        })
        
        store.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(!store.isChecked && directions.includes(cell) && ( !cell.props.fig || attackedCells.includes(cell) ) ){
                    if( (cellX < x && cellY < y) && (cellX >= blockTL.x && cellY >= blockTL.y) ){
                        freeCells.push(cell)
                    }
                    if( (cellX > x && cellY > y) && (cellX <= blockBR.x && cellY <= blockBR.y) ){
                        freeCells.push(cell)
                    }
                    if( (cellX < x && cellY > y) && (cellX >= blockTR.x && cellY <= blockTR.y) ){
                        freeCells.push(cell)
                    }
                    if( (cellX > x && cellY < y) && (cellX <= blockBL.x && cellY >= blockBL.y) ){
                        freeCells.push(cell)
                    }
                }
            })
        })
        // if (color == 'black' && blockBL.x != 8 && blockBL.y != -1) {
        //     console.log(store.matrix[blockBL.x][blockBL.y]);
        // }
        
        return {freeCells:freeCells,attackedCells:attackedCells,blockCells:blockCells}
    }


    componentWillUpdate(){
        this.freeCells = this.findFreeCells(this.context,this.x,this.y,this.color).freeCells
        this.attackedCells = this.findFreeCells(this.context,this.x,this.y,this.color).attackedCells
    }

    move(){
        if(!this.isChosen && this.context.current == this.color )  {
            this.killSteps()
            this.isChosen = true
            let currentRow = this.context.matrix.find((element,i) => i == this.x);
            let currentCell = currentRow.find((element,i) => i == this.y);
            let {x,y,color} = currentCell.props

            this.freeCells.map((cell) =>{
                let newProps = cell.props
                this.changeCell(newProps.x,newProps.y,<Cell 
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
                            fig=<Bishop 
                                x={newProps.x} 
                                y ={newProps.y} 
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
                />)
            })
            
        }

        else{
            this.isChosen = false
            this.killSteps()
        }
       
    }

    render(){
        return <i className={this.color} onClick={() => this.move()} >n</i>
    }
}