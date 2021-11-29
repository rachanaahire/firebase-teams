
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

// GET from projects collection
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

export const getProjectById = async (pId) => {
    const ref = firebase.firestore().doc(`projects/${pId}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        let data = snapshot.data();
        return data;
    }

    return null
}

export const getRoleByProjectId = async (uid, projectId) => {
    const ref = firebase.firestore().doc(`projects/${projectId}`);
    const snapshot = await ref.get()

    if (snapshot.exists) {
        let data = snapshot.data();
        return (data.owner == uid) ? 'owner'
            : (data.manager.indexOf(uid) > -1) ? 'manager'
                : (data.editor.indexOf(uid) > -1) ? 'editor' : 'viewer';
    }

    return null
};

export const getMembersOfProject = async (pId) => {
    let project_data = await getProjectById(pId);
    let members = {
        owner: await getUserNameByUid(project_data.owner),
        manager: [],
        editor: []
    }

    project_data.manager.forEach(id => {
        getUserNameByUid(id).then((name) => {
            members.manager.push(name);
        })
    });
    project_data.editor.forEach(id => {
        getUserNameByUid(id).then((name) => {
            members.editor.push(name);
        })
    });

    return members;

};

export const getManagerListByProjectId = async (pId) => {
    let project_data = await getProjectById(pId);
    let managerList = [];

    for (const uid of project_data.manager) {
        let obj = {
            uid: uid,
            name: await getUserNameByUid(uid)
        }
        managerList.push(obj)
    }
    return managerList;
};

export const getEditorListByProjectId = async (pId) => {
    let project_data = await getProjectById(pId);
    let managerList = [];

    for (const uid of project_data.editor) {
        let obj = {
            uid: uid,
            name: await getUserNameByUid(uid)
        }
        managerList.push(obj)
    }
    return managerList;
};

export const getManagerNamesByProjectId = async (pId) => {
    let project_data = await getProjectById(pId);
    let managerNames = [];

    for (const uid of project_data.manager) {
        let name = await getUserNameByUid(uid)
        managerNames.push(name)
    }
    return managerNames;
};

export const getEditorNamesByProjectId = async (pId) => {
    let project_data = await getProjectById(pId);
    let editorNames = [];

    for (const uid of project_data.editor) {
        let name = await getUserNameByUid(uid)
        editorNames.push(name)
    }
    return editorNames;
};

// GET from users collection
export const getUserByUid = async (uid) => {
    const ref = firebase.firestore().doc(`users/${uid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        let data = snapshot.data();
        return data;
    }

    return null
};

export const getUserNameByUid = async (uid) => {
    const ref = firebase.firestore().doc(`users/${uid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        let name = snapshot.data().name;
        return name;
    }

    return null
};


// GET from contents collection
export const getAllContent = async () => {
    const ref = db.collectionGroup("contents");
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

export const getContentByProjectId = async (pid) => {
    const ref = firebase.firestore().collection(`projects/${pid}/contents`);
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