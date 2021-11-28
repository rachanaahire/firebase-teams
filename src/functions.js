import React from 'react';
import { auth, db } from './firebase';

const ref = db.collectionGroup("teams");

function getAllProjects(user) {
    const ref = db.collection("projects");
}

function getProjectById(user) {
}


function getTeamsbyUid() {
    ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach(doc => {
            items.push(doc.data());
            console.log(doc.data().roles);
        });
        return items
    })
}

export {
    getAllProjects,
    getProjectById,
    getTeamsbyUid
};