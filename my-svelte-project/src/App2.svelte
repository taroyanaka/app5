<!-- const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const port = 8000;
app.listen(port, "0.0.0.0", () => console.log(`App listening!! at http://localhost:${port}`) );
const sqlite = require('better-sqlite3');
const crypto = require('crypto');

const db_for_app5 = new sqlite('app5.db');

// read_all (POST) /app5/surveys_and_responses/read_all params: uid
 //  => 3種類のデータを取得する。
 //  1. 全てのsurveys,
 //  2. 自分が作成したsurveysとそれに紐づく他のユーザーのresponses(responsesに回答したユーザーの情報は含まれない),
 //  3. 自分が回答したresponsesとそのsurvey

// surveys
// create (POST) /app5/surveys/create params: uid, survey_title, survey_description, survey_price, questions
// delete (POST) /app5/surveys/delete params: id

// responses
// create (POST) /app5/responses/create params: uid, survey_id, answers

const initializeDatabase_app5 = () => {
    db_for_app5.exec(`
        DROP TABLE IF EXISTS responses;
        DROP TABLE IF EXISTS surveys;
        DROP TABLE IF EXISTS users;
    `);

    db_for_app5.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            price REAL DEFAULT 100,
            questions TEXT NOT NULL, -- JSON形式で質問を保存
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id INTEGER NOT NULL,
            respondent_uid TEXT NOT NULL,
            answers TEXT NOT NULL, -- JSON形式で回答を保存
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (survey_id) REFERENCES surveys(id),
            FOREIGN KEY (respondent_uid) REFERENCES users(uid)
        );
    `);
};

app.post('/app5/init-database', (req, res) => {
    const { password } = req.body;

    if (password === 'init') {
        try {
            initializeDatabase_app5();
            res.status(200).json({ message: 'Database initialized successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize database.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});

app.post('/app5/surveys_and_responses/read_all', (req, res) => {
try {
const readAllSurveys = () => {
    const stmt = db_for_app5.prepare('SELECT * FROM surveys');
    return stmt.all();
};
// ログインしていない場合でも表示するためにuidを受け取っていない場合はreadAllSurveysのみを返す
if (!req.body.uid) {
    const result_1 = readAllSurveys();
    res.status(200).json({ surveys: result_1 });
}else{
        // 以降はuidを受け取っている場合の処理
        const { uid } = req.body;
        if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
            return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
        }
        // 存在しないuidの場合は、エラーを返す
        const stmt = db_for_app5.prepare('SELECT COUNT(*) AS count FROM users WHERE uid = ?');
        const result = stmt.get(uid);
        result.count === 0 ? (() => { throw new Error('UID does not exist.'); })() : null;
    
        const hashUid = (uid) => {
            return crypto.createHash('sha256').update(uid).digest('hex');
        };
    
        const hashedUid = hashUid(uid);
    
        const readMySurveysAndResponses = (hashedUid) => {
            const stmt = db_for_app5.prepare(`
                SELECT surveys.*, responses.answers 
                FROM surveys 
                LEFT JOIN responses ON surveys.id = responses.survey_id 
                WHERE surveys.user_id = (SELECT id FROM users WHERE uid = ?)
            `);
            return stmt.all(hashedUid);
        };
        const readMyResponses = (hashedUid) => {
            const stmt = db_for_app5.prepare(`
                SELECT surveys.*, responses.answers 
                FROM responses 
                LEFT JOIN surveys ON responses.survey_id = surveys.id 
                WHERE responses.respondent_uid = ?
            `);
            return stmt.all(hashedUid);
        };
    
        const result_1 = readAllSurveys();
        const result_2 = readMySurveysAndResponses(hashedUid);
        const result_3 = readMyResponses(hashedUid);
        res.status(200).json({ surveys: result_1, mySurveysAndResponses: result_2, myResponses: result_3 });
}
} catch (error) {
    res.status(500).json({ error: 'Failed to read data.' });
    
}
});
    
app.post('/app5/surveys/create', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { uid, survey_title, survey_description, survey_price, questions } = req.body;

    if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
        return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    }

    if (typeof survey_title !== 'string' || survey_title.length < 1 || survey_title.length > 100) {
        return res.status(400).json({ error: 'Invalid survey_title. It must be a string between 1 and 100 characters.' });
    }

    if (survey_description && (typeof survey_description !== 'string' || survey_description.length > 1000)) {
        return res.status(400).json({ error: 'Invalid survey_description. It must be a string up to 1000 characters.' });
    }

    if (typeof survey_price !== 'number' || survey_price < 100 || survey_price > 10000 || survey_price % 100 !== 0) {
        return res.status(400).json({ error: 'Invalid survey_price. It must be a number between 100 and 10000, in increments of 100.' });
    }

    if (!Array.isArray(questions) || questions.length === 0 || questions.some(q => typeof q !== 'string' || q.length < 1 || q.length > 1000)) {
        return res.status(400).json({ error: 'Invalid questions. It must be an array of strings, each between 1 and 1000 characters.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app5.prepare('INSERT INTO surveys (user_id, title, description, price, questions) VALUES ((SELECT id FROM users WHERE uid = ?), ?, ?, ?, ?)');
    const result = stmt.run(hashedUid, survey_title, survey_description || null, survey_price, JSON.stringify(questions));

    res.status(201).json({ message: 'Survey created successfully.', surveyId: result.lastInsertRowid });
});

app.post('/app5/surveys/delete', (req, res) => {
    const { id } = req.body;

    const stmt = db_for_app5.prepare('DELETE FROM surveys WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Survey not found.' });
    }

    res.status(200).json({ message: 'Survey deleted successfully.' });
});

app.post('/app5/responses/create', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { uid, survey_id, answers } = req.body;

    if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
        return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    }

    if (typeof survey_id !== 'number') {
        return res.status(400).json({ error: 'Invalid survey_id. It must be a number.' });
    }

    if (!Array.isArray(answers) || answers.length === 0 || answers.some(a => typeof a !== 'string' || a.length < 1 || a.length > 1000)) {
        return res.status(400).json({ error: 'Invalid answers. It must be an array of strings, each between 1 and 1000 characters.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app5.prepare('INSERT INTO responses (survey_id, respondent_uid, answers) VALUES (?, ?, ?)');
    stmt.run(survey_id, hashedUid, JSON.stringify(answers));

    res.status(201).json({ message: 'Response created successfully.' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); -->

<script>
    import { onMount } from 'svelte';
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import { each } from 'svelte/internal';

    const firebase_config = {
        apiKey: "AIzaSyBcOlIDP2KWbJuKM0WeMHNp-WvjTVfLt9Y",
        authDomain: "p2auth-ea50a.firebaseapp.com",
        projectId: "p2auth-ea50a",
        storageBucket: "p2auth-ea50a.appspot.com",
        messagingSenderId: "796225429484",
        appId: "1:796225429484:web:ece56ef2fc0be28cd6eac9"
    };
    firebase.initializeApp(firebase_config);
    const google_provider = new firebase.auth.GoogleAuthProvider();

    let error_message = '';
    let user = null;
    let uid = "user1";
    let login_result = 'Not logged in';
    let web_data = [];
let web_data_surveys = [];
let web_data_mySurveysAndResponses = [];
let web_data_myResponses = [];
    let app5_title = 'GAFAM';
    let app5_text = `https://www.google.com
https://www.amazon.com
https://www.apple.com
https://www.microsoft.com
https://www.facebook.com`;
    let convert_data_0 = null;
    let convert_data_1 = null;
    let is_editing_app5_title = false;
    let url_list = '';
    // const endpoint = "https://cotton-concrete-catsup.glitch.me";
    const endpoint = "http://localhost:8000";
    let open_volume = 1;
    let url_list_lines = [];
    let options = [];
    let urls = [];

    //             <!-- survey_title, survey_description, survey_price, questions を入力する、それぞれのformを作るための変数 -->
    let survey_title = '';
    let survey_description = '';
    let questions = '';
    let survey_price = 100;

    const service_name = 'app5!!';


    function check_login() {
        firebase.auth().onAuthStateChanged(current_user => {
            user = current_user;
            if (user) {
                login_result = `Logged in as: ${user.displayName}`;
                uid = user.uid;
                fetch_data_with_get();
            } else {
                login_result = 'Not logged in';
                uid = "";
            }
        });
    }

    function google_login() {
        firebase.auth().signInWithPopup(google_provider).then(result => {
            user = result.user;
            login_result = `Logged in as: ${user.displayName}`;
        }).catch(error => {
            console.error('Error during Google login:', error);
            alert('Google login failed. ' + error.message);
        });
    }

    function sign_out() {
        firebase.auth().signOut().then(() => {
            user = null;
            login_result = 'Not logged in';
        }).catch(error => {
            console.error('Error during sign-out:', error);
            alert('Sign out failed. ' + error.message);
        });
    }

    async function fetch_data() {
        try {
            console.log('fetch_data');
            const response = await fetch(endpoint + '/app5/surveys_and_responses/read_all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });
            const data = await response.json();
            web_data_surveys = data.surveys;
            web_data_mySurveysAndResponses = data.mySurveysAndResponses;
            web_data_myResponses = data.myResponses;
            // res.status(200).json({ surveys: result_1, mySurveysAndResponses: result_2, myResponses: result_3 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    async function create_record() {
        try {
            convert_data(app5_title, app5_text);
            const response = await fetch(endpoint + '/app5/surveys/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: uid,
                    survey_title: survey_title,
                    survey_description: survey_description,
                    survey_price: 100,
                    questions: questions,
                })
            });
            const data = await response.json();
            console.log('Record created:', data);
            fetch_data(); // Refresh the data
        } catch (error) {
            console.error('Error creating record:', error);
        }
    }

    async function delete_record(id) {
        try {
            const response = await fetch(endpoint + '/app5/surveys/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            console.log('Record deleted:', data);
            fetch_data(); // Refresh the data
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }

    // // create (POST) /app5/responses/create params: uid, survey_id, answers
    async function create_response(survey_id) {
        try {
            const response = await fetch(endpoint + '/app5/responses/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: uid,
                    survey_id: survey_id
                })
            });
            const data = await response.json();
            console.log('Response created:', data);
        } catch (error) {
            console.error('Error creating response:', error);
        }
    }



    $: {
        url_list_lines = url_list.split('\n').filter(line => line.trim() !== '');
        if (url_list_lines.length > 100) {
            error_message = 'URLリストは100行までです。';
        } else {
            error_message = '';
        }
        options = Array.from({ length: url_list_lines.length }, (_, i) => i + 1);
        if (options.length > 0) {
            open_volume = Math.max(open_volume, options[options.length - 1]);
        }
    }

    function service_tab_open(url) {
        window.open(url, '_blank');
    }

    async function service_exe() {
        urls = url_list_lines.slice(0, open_volume);
        urls.forEach(url => service_tab_open(url));
    }

    function service_toggle_edit_app5_title() {
        is_editing_app5_title = !is_editing_app5_title;
    }

    function service_update_app5_title() {
        is_editing_app5_title = false;
    }

    onMount(() => {
        // check_login();
        fetch_data();
        // fetch_data_with_get();
    });
</script>

<div class="container">
    <div class="header">
        <h1>{service_name}</h1>
        {#if user}
            <button on:click={sign_out}>Logout</button>
        {:else}
            <button on:click={google_login}>Login</button>
        {/if}
    </div>
    <div class="content">
        <div class="left-column server_side">
            <div class="console">
                {#if error_message}
                <button id="error_message" on:click={() => error_message = ''} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') error_message = ''; }} style="background: none; border: none; padding: 0; margin: 0; color: inherit; font: inherit; cursor: pointer;">
                    {error_message}
                </button>
                {/if}
                <p>{login_result}</p>
                <p>{app5_title}</p>
                {#if user}
                <button on:click={create_record}>Create Record</button>
                {/if}
                <p>uid: {uid}</p>
            </div>
            <div class="list">
                <ul>
<div>
    <h2>web_data_surveys</h2>
    {#each web_data_surveys as item}
    <li>
<div class="in_list"><h3>id: {item.id}</h3><h3>title: {item.title},</h3><h4>description: {item.description}</h4><h5>user_id: {item.user_id}</h5></div>
        questions ->
        {#each JSON.parse(item.questions) as question}
            <span>{question}</span>
        {/each}
        answers ->
        {#if item.answers}
        {#each item.answers as all_answer}
            {#each all_answer as answer}
                <span>{answer}</span>
            {/each}
        {/each}
        {/if}
        <p>price: {item.price}</p>
        <!-- <p>created_at: {item.created_at}</p> -->
        <!-- <p>updated_at: {item.updated_at}</p> -->
        <!-- <p>user_id: {item.user_id}</p> -->
    </li>
    {/each}
</div>
<div>
    <h2>web_data_mySurveysAndResponses</h2>
    {#each web_data_mySurveysAndResponses as item}
    <!--  -->
        <li>
<div class="in_list"><h3>id: {item.id}</h3><h3>title: {item.title},</h3><h4>description: {item.description}</h4><h5>user_id: {item.user_id}</h5></div>
            questions ->
            {#each JSON.parse(item.questions) as question}
                <span>{question}</span>
            {/each}
            answers ->
            {#if item.answers}
            {#each item.answers as all_answer}
                {#each all_answer as answer}
                    <span>{answer}</span>
                {/each}
            {/each}
            {/if}
            <p>price: {item.price}</p>
            <!-- <p>created_at: {item.created_at}</p> -->
            <!-- <p>updated_at: {item.updated_at}</p> -->
            <!-- <p>user_id: {item.user_id}</p> -->
        </li>
    {/each}
</div>
<div>
    <h2>web_data_myResponses</h2>
    {#each web_data_myResponses as item}
        <li>
<div class="in_list"><h3>id: {item.id}</h3><h3>title: {item.title},</h3><h4>description: {item.description}</h4><h5>user_id: {item.user_id}</h5></div>
            questions ->
            {#each JSON.parse(item.questions) as question}
                <span>{question}</span>
            {/each}
            answers ->
            {#if item.answers}
                {#each JSON.parse(item.answers) as answer}
                    <span>{answer}</span>
                {/each}
            {/if}
            <p>price: {item.price}</p>
            <!-- <p>created_at: {item.created_at}</p> -->
            <!-- <p>updated_at: {item.updated_at}</p> -->
            <!-- <p>user_id: {item.user_id}</p> -->
        </li>
    {/each}
</div>

                </ul>
            </div>
        </div>
        <div class="right-column">
            {#if is_editing_app5_title}
                <input type="text" bind:value={app5_title} />
                <button on:click={service_update_app5_title}>Update</button>
            {:else}
                <button on:click={service_toggle_edit_app5_title}>Change Title</button>
            {/if}
            <button on:click={() => survey_description = test_app5_text}>Test Text List</button>

            <!-- survey_title, survey_description, survey_price, questions を入力する、それぞれのformを作る -->
            <div>
                <h3>Create Survey</h3>
                <form on:submit|preventDefault={create_record}>
                    <div>
                        <label for="survey_title">Title:</label>
                        <input type="text" id="survey_title" bind:value={survey_title} required />
                    </div>
                    <div>
                        <label for="survey_description">Description:</label>
                        <textarea id="survey_description" bind:value={survey_description}></textarea>
                    </div>
                    <div>
                        <label for="survey_price">Price:</label>
                        <input type="number" id="survey_price" bind:value={survey_price} min="100" max="10000" step="100" required />
                    </div>
                    <div>
                        <label for="questions">Questions (one per line):</label>
                        <textarea id="questions" bind:value={questions}></textarea>
                    </div>
                    <button type="submit">Create Survey</button>
                </form>
            </div>


            <!-- create_responseのためのボタン -->
            <!-- {#each web_data as item}
                <button on:click={() => create_response(item.id)}>回答する</button>
            {/each} -->

        </div>
    </div>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .content {
        display: flex;
        width: 100%;
    }
    .left-column, .right-column {
        flex: 1;
        padding: 10px;
    }
    textarea {
        width: 100%;
        height: 50vh;
    }
    .in_list > * {
/* inline要素に */
        display: inline;
        /* それぞれの要素を1rem間を開ける */
        margin-right: 1rem;

    }
</style>