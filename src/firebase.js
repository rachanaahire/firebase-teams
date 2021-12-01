
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {

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

export const getMembersIdOfProject = async (pId) => {
    let project_data = await getProjectById(pId);
    let members = []

    project_data.manager.forEach(id => {
        members.push(id)
    });
    project_data.editor.forEach(id => {
        members.push(id)
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

// export const getMembersDemo = async (uid) => {
//     const ref = firebase.firestore().collection(`projects`);
//     ref = ref.where('manager', "array-contains", uid)
//     ref = ref.where('editor', "array-contains", uid)
//     ref = ref.where('owner', "array-contains", uid)
//     const snapshot = await ref.get();

//     if (snapshot.size) {
//         const items = [];
//         snapshot.forEach(doc => {
//             // let data = { ...doc.data(), uid: doc.id }
//             items.push(data);
//         });
//         return items
//     }

//     return null
// };

// GET from users collection
export const getAllUsers = async () => {
    const ref = firebase.firestore().collection(`users`);
    const snapshot = await ref.get();

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            let data = { ...doc.data(), uid: doc.id }
            items.push(data);
        });
        return items
    }

    return null
};

export const getNonMembersUserList = async (pid) => {
    const ref = firebase.firestore().collection(`users`);
    const snapshot = await ref.get();
    let memberList = await getMembersIdOfProject(pid)

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            if (!memberList.includes(doc.id)) {
                let obj = {
                    uid: doc.id,
                    name: doc.data().name
                }
                items.push(obj);
            }
        });
        return items
    }

    return null
};

export const getMembersUserList = async (pid) => {
    const ref = firebase.firestore().collection(`users`);
    const snapshot = await ref.get();
    let memberList = await getMembersIdOfProject(pid)

    if (snapshot.size) {
        const items = [];
        snapshot.forEach(doc => {
            if (memberList.includes(doc.id)) {
                let obj = {
                    uid: doc.id,
                    name: doc.data().name
                }
                items.push(obj);
            }
        });
        return items
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

export const getContentOfAuthor = async (pid, uid) => {
    const ref = firebase.firestore().collection(`projects/${pid}/contents`).where('author','==',uid);
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


// UPDATE in projects collection
export const updateProjectById = async (pid, data) => {
    const ref = firebase.firestore().doc(`projects/${pid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        await snapshot.ref.update({ name: data.projectName, description: data.projectDescp });
    }
};

export const addMembers = async (pid, data) => {
    const ref = firebase.firestore().doc(`projects/${pid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        if (data.role == 'manager') {
            await snapshot.ref.update({ manager: firebase.firestore.FieldValue.arrayUnion(data.member) });
        } else {
            await snapshot.ref.update({ editor: firebase.firestore.FieldValue.arrayUnion(data.member) });
        }
    }
};

export const delMembers = async (pid, id) => {
    const ref = firebase.firestore().doc(`projects/${pid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        let data = snapshot.data();
        if (data.manager.includes(id)) {
            await snapshot.ref.update({ manager: firebase.firestore.FieldValue.arrayRemove(id) });
        } else {
            await snapshot.ref.update({ editor: firebase.firestore.FieldValue.arrayRemove(id) });
        }
    }
};

export const updateContentById = async (data, pid, cid) => {
    const ref = firebase.firestore().doc(`projects/${pid}/contents/${cid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        await snapshot.ref.update({ heading: data.heading, body: data.body });
    }
};

export const deleteContentById = async (pid, cid) => {
    const ref = firebase.firestore().doc(`projects/${pid}/contents/${cid}`);
    const snapshot = await ref.get();

    if (snapshot.exists) {
        await snapshot.ref.delete();
    }
};

//ADD Contents
export const addContent = async (data, pid, uid) => {
    await db.collection(`projects/${pid}/contents`).doc().set({ heading: data.heading, body: data.body, author: uid });
};

export const addProject = async (data, uid) => {
    await db.collection(`projects`).doc().set({
        name: data.name,
        description: data.description,
        manager: db.fi,
        editor: data.editors,
        owner: uid,
        createdOn: new Date()
    });
};

