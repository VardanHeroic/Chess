import React from 'react';
import {store} from './context.jsx'
import {Cell} from './cell.jsx';
import {Pawn} from './pawn.jsx'
import {Rook} from './rook.jsx'
import {Bishop} from './bishop.jsx'
import {Qween} from './qween.jsx'
import {Knight} from './knight.jsx';
import {King} from './king.jsx';

class Board extends React.Component { 
    constructor(props){
        super(props)
        this.state={
            matrix:this.matrixInit(),
            current:'white',
            isChecked: false,
            checkPath: [],
            checkDirections: [],
        }
    }

    static contextType = store


    matrixInit(){
        let matrix = []
        for (let i = 0; i < 8; i++) {
            matrix[i] = []
            for(let j = 0; j < 8; j++){;
                if ((i % 2 == 1 && j % 2 == 1) || (i % 2 == 0 && j % 2 ==0)  ) {;
                    matrix[i][j] = <Cell color='wcell' x={i} y={j} key={i*10 + j}  />
                    if(i == 6){
                        matrix[i][j] = <Cell color='wcell' x={i} y={j} key={i*10 + j} fig=<Pawn x={i} y={j} color='white' isStart={true} /> />
                    }
                    if(i == 1){
                        matrix[i][j] = <Cell color='wcell' x={i} y={j} key={i*10 + j} fig=<Pawn x={i} y={j} color='black' isStart={true} /> />
                    }
                    
                }
                else{
                    matrix[i][j] = <Cell color='bcell' x={i} y={j} key={i*10 + j} />
                    if(i == 6){
                        matrix[i][j] = <Cell color='bcell' x={i} y={j} key={i*10 + j} fig=<Pawn x={i} y={j} color='white' isStart={true}  /> />
                    }
                    if(i == 1){
                        matrix[i][j] = <Cell color='bcell' x={i} y={j} key={i*10 + j} fig=<Pawn x={i} y={j} color='black' isStart={true} /> />
                    }
                    
                }   
            }
        }
        
        matrix[0][7] = <Cell color='bcell' x={0} y={7} key={0*10 + 7} fig=<Rook x={0} y={7} color='black'  /> />
        matrix[7][0] = <Cell color='bcell' x={7} y={0} key={7*10 + 0} fig=<Rook x={7} y={0} color='white'  /> />
        matrix[0][0] = <Cell color='wcell' x={0} y={0} key={0*10 + 0} fig=<Rook x={0} y={0} color='black'  /> />
        matrix[7][7] = <Cell color='wcell' x={7} y={7} key={7*10 + 7} fig=<Rook x={7} y={7} color='white'  /> />

        matrix[0][6] = <Cell color='wcell' x={0} y={6} key={0*10 + 6} fig=<Knight x={0} y={6} color='black'  /> />
        matrix[7][1] = <Cell color='wcell' x={7} y={1} key={7*10 + 1} fig=<Knight x={7} y={1} color='white'  /> />
        matrix[0][1] = <Cell color='bcell' x={0} y={1} key={0*10 + 1} fig=<Knight x={0} y={1} color='black'  /> />
        matrix[7][6] = <Cell color='bcell' x={7} y={6} key={7*10 + 6} fig=<Knight x={7} y={6} color='white'  /> />

        matrix[0][5] = <Cell color='bcell' x={0} y={5} key={0*10 + 5} fig=<Bishop x={0} y={5} color='black'  /> />
        matrix[7][2] = <Cell color='bcell' x={7} y={2} key={7*10 + 2} fig=<Bishop x={7} y={2} color='white'  /> />
        matrix[0][2] = <Cell color='wcell' x={0} y={2} key={0*10 + 2} fig=<Bishop x={0} y={2} color='black'  /> />
        matrix[7][5] = <Cell color='wcell' x={7} y={5} key={7*10 + 5} fig=<Bishop x={7} y={5} color='white'  /> />

        matrix[0][3] = <Cell color='bcell' x={0} y={3} key={0*10 + 3} fig=<Qween x={0} y={3} color='black'  /> />
        matrix[7][3] = <Cell color='wcell' x={7} y={3} key={7*10 + 3} fig=<Qween x={7} y={3} color='white'  /> />

        matrix[0][4] = <Cell color='wcell' x={0} y={4} key={0*10 + 4} fig=<King x={0} y={4} color='black'  /> />
        matrix[7][4] = <Cell color='bcell' x={7} y={4} key={7*10 + 4} fig=<King x={7} y={4} color='white'  /> />
        
        return matrix
    }

    findCheckDirections(){
        this.state.matrix.map((row,cellX) =>
            row.map((cell,cellY) => {
                if(cell.props.fig){
                    if(this.state.current !== cell.props.fig.props.color){
                        if(cell.props.fig.type.name == 'Pawn'){
                            return cell.props.fig.type.prototype.findFreeCells(this.state,cellX,cellY,cell.props.fig.props.color).attackDirections
                        }
                        else {
                            return cell.props.fig.type.prototype.findFreeCells(this.state,cellX,cellY,cell.props.fig.props.color).freeCells
                        }

                    }
                }
            }
        ))
    }

    componentDidMount(){
        setInterval(() => {this.context.matrix = this.state.matrix ;this.setState({matrix: this.context.matrix})},250)
    }

    render(){
        return(
            <div className="board">
                <store.Provider value={this.state} >
                {
                    this.state.matrix.map((row,i) => { return <div key={i} className='row'>{row}</div>})
                }
                </store.Provider>
            </div>
        )
    }
    
}

export function App() {
    return(
        <store.Provider value={{current:'white',isChecked:false,checkPath: [],checkDirections: []}} >
            <Board/>
        </store.Provider>
    ) 
}
