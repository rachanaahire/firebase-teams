//import './App.css';
import firebase from '../firebase';
import React, { useState, useEffect } from 'react';

function Teams(props) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const db = firebase.firestore();
    let ref = db.collectionGroup("members").where("team_id", "==", 3);

    function getUsersByTeam() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
                console.log("Thiddds is data: ", doc.data());
            })
            setMembers(items);
            setLoading(false);
        })
    }

    useEffect(() => {
        getUsersByTeam();
    }, []);

    
    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <> <div>{
            members.map((member) => (
                <div key={member.id}> 
                    <h2>{member.name}</h2>
                </div>
            ))
        }</div>
        </>
    );
}

export default Teams;
