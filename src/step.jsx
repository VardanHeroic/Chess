import React from "react"
import { store } from "./context.jsx"

export class Step extends React.Component{
    constructor(props){
        super(props)
        this.victim = props.victim
        this.fig = props.fig
        this.oldFig = props.oldFig
        this.attackedCells = props.attackedCells
        this.x = props.x
        this.y = props.y
    }

    static contextType = store

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

    changeCell(x,y,obj) {
        this.context.matrix[x][y] = obj 
    }

    findCheckDirections(){
        let directions = []
        this.context.matrix.map((row,cellX) =>
                row.map((cell,cellY) => {
                    if(cell.props.fig){
                        if(this.context.current !== cell.props.fig.props.color && cell.props.fig.type.name !== 'Step'){
                            if(cell.props.fig.type.name == 'Pawn'){
                                cell.props.fig.type.prototype.findFreeCells(this.context,cellX,cellY,cell.props.fig.props.color).attackDirections.map(cell => {directions.push(cell)})
                            }
                            else {
                                cell.props.fig.type.prototype.findFreeCells(this.context,cellX,cellY,cell.props.fig.props.color).freeCells.map(cell => {directions.push(cell)})
                            }
                        }
                    }
                }
            )
        )
        return directions
    }

    change(){
        this.context.current = this.fig.props.fig.props.color == 'white' ? 'black' : 'white'
        this.killSteps()
        this.changeCell(this.x,this.y,this.fig)
        this.changeCell(this.oldFig.props.x,this.oldFig.props.y,this.oldFig)
        this.killSteps()
        this.context.checkDirections = this.findCheckDirections()
        if(!this.context.isChecked){
           this.context.checkDirections.map(cell => {
                if (cell.props.fig) {
                    if(cell.props.fig.type.name == 'King' && cell.props.fig.props.color == this.context.current){
                        this.context.isChecked = true
                        alert('Check!');
                    }
                }
            })
        }
        else{
            this.context.isChecked = false
        }
        // console.log(this.context.checkDirections,this.context.current,this.context.isChecked);
    }

    render(){
        return( <i onClick={() => this.change()} >●</i> )
    }
}