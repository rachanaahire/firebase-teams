//import './App.css';
import { db } from '../firebase';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Teams from './Teams';


function Home() {

    const [teams, setTeams] = useState([]);
    const [nav, setNav] = useState(false);
    const [loading, setLoading] = useState(false);

    const ref = db.collectionGroup("teams");

    function getTeams() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setTeams(items);
            setLoading(false);
        })
    }

    function addUser() {
        db.collection("users").add({
            name: "Tokyo",
            id: 12,
            email: "tokyo@ed.com"
        })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    function getUsersByTeam() {
        db.collectionGroup("members").where("team_id", "==", 1).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                console.log("This is data: ", doc.data());
            })
        })
    }

    function getTeamByUser() {
        db.collectionGroup("members").where("id", "==", 1).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                console.log("This is data: ", doc.data());
            })
        })
    }

    function updateUser() {

        const ref = db.collection("users").doc('BwLYLB7LZxsgMMBDCK74');
        ref.update({ name: "Sams" }).then(() => {
            ref.onSnapshot((doc) => {
                let user_data = db.collectionGroup("members").where("id", "==", doc.data().id);
                user_data.onSnapshot((docRef) => {
                    docRef.forEach((doc) => {
                        doc.ref.update({ name: "Sams" }).then(() => { console.log('DONE') })
                    })
                })
            })
        });

    }

    useEffect(() => {
        getTeams();
        //getUsersByTeam();
        //getTeamByUser();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    const handleClick = () => setNav(true);

    return (
        <>
            <div>
                <h1>Teams</h1>
                {
                    teams.map((team) => (
                        <div key={team.id}> <br />
                            <Button onClick={handleClick}>
                                <h2>{team.name}</h2>
                            </Button><br />
                        </div>
                    ))
                }
                <br /><br />

                {nav ? <Teams /> : null}
            </div>
        </>
    );
}

export default Home;
