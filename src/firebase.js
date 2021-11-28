
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// const firebaseConfig = {
//     apiKey: "AIzaSyD7i_G4Z5EPkhz_M8fXXFyWsvbR8u_I0FQ",

//     authDomain: "teams-feature.firebaseapp.com",

//     projectId: "teams-feature",

//     storageBucket: "teams-feature.appspot.com",

//     messagingSenderId: "303610883430",

//     appId: "1:303610883430:web:56ede584d18037f7de6ca7"

// };
const firebaseConfig = {

    apiKey: "AIzaSyD3RComsvExCi6USR-O4qTQpY_YvuP9tfY",

    authDomain: "teams-demo-b6f30.firebaseapp.com",

    projectId: "teams-demo-b6f30",

    storageBucket: "teams-demo-b6f30.appspot.com",

    messagingSenderId: "931424015680",

    appId: "1:931424015680:web:3cb4bd256f89ebef55d6a5"

};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const createUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = firebase.firestore().doc(`users/${user.uid}`);

    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email } = user;
        const { name } = additionalData;

        try {
            await userRef.set({
                name,
                email,
                createdAt: new Date(),
            });
        } catch (error) {
            console.log('Error in creating user', error);
        }
    }
};
export const getAllProjects = async () => {
    const ref = firebase.firestore().collection("projects");
    const snapshot = await ref.get()

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            let data = { ...doc.data(), docId: doc.id }
            items.push(data);
        });
        return items
    }

    return null
};

export const getProjectIfManager = async (uid) => {
    const ref = db.collection("projects").where('manager', "array-contains", uid);
    const snapshot = await ref.get()

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            let data = { ...doc.data(), docId: doc.id }
            items.push(data);
        });
        return items
    }

    return null
};

export const getProjectIfOwner = async (uid) => {
    const ref = db.collection("projects").where('owner', "==", uid);
    const snapshot = await ref.get()

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            let data = { ...doc.data(), docId: doc.id }
            items.push(data);
        });
        return items
    }

    return null
};

export const getProjectIfEditor = async (uid) => {
    const ref = db.collection("projects").where('editor', "array-contains", uid);
    const snapshot = await ref.get()

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            let data = { ...doc.data(), docId: doc.id }
            items.push(data);
        });
        return items
    }

    return null
};

export const getProjectsByUid = async (uid) => {
    let items = [];
    const data1 = await getProjectIfOwner(uid);
    if (data1) items.push(...data1);
    const data2 = await getProjectIfManager(uid);
    if (data2) items.push(...data2);
    const data3 = await getProjectIfEditor(uid);
    if (data3) items.push(...data3);

    if (items.length) {
        return items
    }

    return null
};

export const getRoleByTeamId = async (uid, teamId) => {
    const ref = firebase.firestore().doc(`projects/${teamId}`);
    const snapshot = await ref.get()

    if (snapshot.exists) {
        let data = snapshot.data();
        return (data.owner == uid) ? 'owner'
            : (data.manager.indexOf(uid) > -1) ? 'manager'
                : (data.editor.indexOf(uid) > -1) ? 'editor' : 'viewer';
    }

    return null
};

export const getUserByUid = async (uid) => {
    const ref = firebase.firestore().doc(`users/${uid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        let data = snapshot.data();
        return data;
    }

    return null
};
