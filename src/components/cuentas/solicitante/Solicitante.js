import React, { Component } from "react";
import SolicitantesTab from "./tabSolicitante";


class Solicitante extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        
    }
    render() {

        return (
            < >
                <div className="card-container">
                <h1 className="titulo" style={{marginLeft: "2rem"}}>Solicitantes</h1>
                <SolicitantesTab

                />
                    {/* <Tabs tabBarExtraContent={<div >
                    </div>}
                    type="card" size="large" >
                        <TabPane tab="SOLICITANTES" key="">
                            <SolicitantesTab

                            />
                        </TabPane>
                    
                    </Tabs> */}
                </div>
            </>
        );
    }
} 

export default Solicitante;