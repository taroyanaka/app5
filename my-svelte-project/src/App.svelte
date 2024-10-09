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
    let your_id = null;
    let login_result = 'Not logged in';
    // let web_data = [];
let web_data_surveys = [];
let web_data_mySurveysAndResponses = [];
let web_data_myResponses = [];
    // let app5_title = 'GAFAM';
//     let app5_text = `https://www.google.com
// https://www.amazon.com
// https://www.apple.com
// https://www.microsoft.com
// https://www.facebook.com`;

    // let is_editing_app5_title = false;
    // const endpoint = "https://cotton-concrete-catsup.glitch.me";
    const endpoint = "http://localhost:8000";
    let open_volume = 1;
    let options = [];
    let urls = [];

    //             <!-- survey_title, survey_description, survey_price, questions を入力する、それぞれのformを作るための変数 -->
    let survey_title = '';
    let survey_description = '';
    let questions = '';
    let survey_price = 100;
    let answers = 'abcdef';

    // 以下の項目にサンプルデータを投入するサンプル投入関数
// survey_title
// survey_description
// questions
// survey_price
// answers
// survey_id
const sample_data = () => [survey_title, survey_description, questions, survey_price, answers, survey_id] = ['サンプルアンケート', 'サンプルアンケートの説明', '質問1\n質問2\n質問3', 100, '回答1\n回答2\n回答3', 1];

    let survey_id = null;



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
            your_id = data.id || null;
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
                    questions: questions.split('\n'),
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

    const set_data_to_create_response_mode = (id) => {
        try {
            // idが空白の場合はエラー
            console.log('id:', id);
        if (!id) throw new Error('ID is empty.');
        // web_data_surveysが存在しない場合はエラー
        if (!web_data_surveys) throw new Error('web_data_surveys not found.');
        // 指定したidのquestionsを取得して、answersの入力欄に表示する
        const survey = web_data_surveys.find(s => s.id === id);
        // console.log('id:', id);
        // console.log('Survey:', survey);
        if (!survey) throw new Error('Survey not found.');
        if (!survey.questions) throw new Error('Questions not found.');
        if (typeof survey.questions !== 'string') throw new Error('Questions not a string.');
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(survey.questions);
        } catch (e) {
            throw new Error('Questions not valid JSON.');
        }
        if (!Array.isArray(parsedQuestions)) throw new Error('Questions not an array.');
        // console.log('Questions:', typeof survey.questions);
        // console.log('parse Questions:', JSON.parse(survey.questions));
        answers = JSON.parse(survey.questions).join('\n');
        survey_id = id;
        } catch (error) {
            console.error('Error setting data to create response mode:', error);            
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
                    survey_id: survey_id,
                    answers: answers
                })
            });
            const data = await response.json();
            console.log('Response created:', data);
        } catch (error) {
            console.error('Error creating response:', error);
        }
    }



    $: {
        console.log('web_data_surveys:', web_data_surveys);
        console.log('web_data_mySurveysAndResponses:', web_data_mySurveysAndResponses);
        console.log('web_data_myResponses:', web_data_myResponses);
// create surveryのボタンを押した時に空欄があったらエラーを表示する
        if (survey_title === '' || survey_description === '' || questions === '') {
            error_message = 'Please fill in all fields.';
        } else {
            error_message = '';
        }
        // create responseのボタンを押した時に空欄があったらエラーを表示する
        if (answers === '') {
            error_message = 'Please fill in all fields.';
        } else {
            error_message = '';
        }


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
                {#if user}
                <button on:click={create_record}>Create Record</button>
                {/if}
                <p>uid: {uid}</p>
                <p>your_id: {your_id}</p>
            </div>



            <div class="list">
                <ul>
                    <div>
                        <h2>web_data_surveys</h2>
                        {#each web_data_surveys as item}
                            <li>
                                <div class="in_list">
                                    <h3>id: {item.id}</h3>
                                    <h3>title: {item.title},</h3>
                                    <h4>description: {item.description}</h4>
                                    <h5>user_id: {item.user_id}</h5>
                                </div>
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
                                {#if your_id !== item.user_id}
                                    <button on:click={() => set_data_to_create_response_mode(item.id)}>set_data_to_create_response_mode</button>
                                {/if}
                            </li>
                        {/each}
                    </div>
                    <div>
                        <h2>web_data_mySurveysAndResponses</h2>
                        {#each web_data_mySurveysAndResponses as item}
                            <li>
                                <div class="in_list">
                                    <h3>id: {item.id}</h3>
                                    <h3>title: {item.title},</h3>
                                    <h4>description: {item.description}</h4>
                                    <h5>user_id: {item.user_id}</h5>
                                </div>
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
                            </li>
                        {/each}
                    </div>
                    <div>
                        <h2>web_data_myResponses</h2>
                        {#each web_data_myResponses as item}
                            <li>
                                <div class="in_list">
                                    <h3>id: {item.id}</h3>
                                    <h3>title: {item.title},</h3>
                                    <h4>description: {item.description}</h4>
                                    <h5>user_id: {item.user_id}</h5>
                                </div>
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
                            </li>
                        {/each}
                    </div>
                </ul>
            </div>




    </div>
        <div class="right-column">
            <!-- sample_dataボタン -->
            <button on:click={sample_data}>Sample Data</button>

            <!-- survey_title, survey_description, survey_price, questions を入力する、それぞれのformを作る -->
            <div class="create_survey_mode">
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

            <!-- create_response_mode -->
            <div class="create_response_mode">
                <h3>Create Response</h3>
                <!-- uid, survey_id, answers -->
                <form on:submit|preventDefault={() => create_response(survey_id)}>
                    <div>
                        <span>Survey ID: {survey_id}</span>
                        <label for="answers">Answers (one per line):</label>
                        <textarea id="answers" bind:value={answers} required></textarea>
                    </div>
                    <button type="submit">Create Response</button>
                </form>
            </div>

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



<!-- 
    ///////////////////////////server_express.js/////////////////////////////
    ///////////////////////////server_express.js/////////////////////////////
    ///////////////////////////server_express.js/////////////////////////////
    
    ///////////////////////////AI/////////////////////////////
    // 以下のコードを以下のルールで書き換えて
    // pop_up_url => app5
    // app5_title => app5_title TEXT not nullで1文字以上100文字以下
    // url_list => app5_text TEXT nullで1文字以上1000文字以下
    ///////////////////////////AI/////////////////////////////
    const express = require('express');
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

const insertTestData_app5 = () => {
    const users = [
        { uid: 'user1' },
        { uid: 'user2' },
        { uid: 'user3' }
    ];

    const surveys = [
        {
            user_id: 1,
            title: 'Survey 1',
            description: 'Description for survey 1',
            price: 200,
            questions: JSON.stringify(['Question 1', 'Question 2'])
        },
        {
            user_id: 2,
            title: 'Survey 2',
            description: 'Description for survey 2',
            price: 300,
            questions: JSON.stringify(['Question 3', 'Question 4'])
        }
    ];

    const responses = [
        {
            survey_id: 1,
            respondent_uid: 'user2',
            answers: JSON.stringify(['Answer 1', 'Answer 2'])
        },
        {
            survey_id: 2,
            respondent_uid: 'user3',
            answers: JSON.stringify(['Answer 3', 'Answer 4'])
        },
        // user2のsurveyに対するuser1のresponse
        {
            survey_id: 2,
            respondent_uid: 'user1',
            answers: JSON.stringify(['Answer 5', 'Answer 6'])
        },
    ];

    const insertUser = db_for_app5.prepare('INSERT INTO users (uid) VALUES (?)');
    users.forEach(user => insertUser.run(user.uid));

    const insertSurvey = db_for_app5.prepare('INSERT INTO surveys (user_id, title, description, price, questions) VALUES (?, ?, ?, ?, ?)');
    surveys.forEach(survey => insertSurvey.run(survey.user_id, survey.title, survey.description, survey.price, survey.questions));

    const insertResponse = db_for_app5.prepare('INSERT INTO responses (survey_id, respondent_uid, answers) VALUES (?, ?, ?)');
    responses.forEach(response => insertResponse.run(response.survey_id, response.respondent_uid, response.answers));
};


app.post('/app5/init-database', (req, res) => {
    const { password } = req.body;

    if (password === 'init') {
        try {
            initializeDatabase_app5();
            // insertTestData_app5();
            res.status(200).json({ message: 'Database initialized successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize database.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});

// initializeDatabase_app5();
// insertTestData_app5();

app.post('/app5/insert-test-data', (req, res) => {
    const { password } = req.body;

    if (password === 'testdata') {
        try {
            insertTestData_app5();
            res.status(200).json({ message: 'Test data inserted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to insert test data.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});

app.post('/app5/surveys_and_responses/read_all', (req, res) => {
try {
const readAllSurveysAndResponses = () => {
    // 回答のないsurveyも含めて全て取得するため、LEFT JOINを使用
    const stmt = db_for_app5.prepare(`
        SELECT surveys.*, responses.answers 
        FROM surveys 
        LEFT JOIN responses ON surveys.id = responses.survey_id
    `);
    const res1 = stmt.all();
    console.log(res1);


    // 同じidのsurveyが複数回表示されるのを防ぐために、idをキーにしてanswersを配列にまとめる
    const surveys = res1.reduce((acc, cur) => {
        if (!acc[cur.id]) {
            acc[cur.id] = { ...cur, answers: [] };
        }
        if (cur.answers) {
            acc[cur.id].answers.push(cur.answers);
        }
        return acc;
    }, {});
    return Object.values(surveys);

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
        // const hashedUid = uid;
    
        const readMySurveysAndResponses = (hashedUid) => {
            const stmt = db_for_app5.prepare(`
                SELECT surveys.*, responses.answers 
                FROM surveys 
                LEFT JOIN responses ON surveys.id = responses.survey_id 
                WHERE surveys.user_id = (SELECT id FROM users WHERE uid = ?)
            `);
            // 同じidのsurveyが複数回表示されるのを防ぐために、idをキーにしてanswersを配列にまとめる
            const res2 = stmt.all(hashedUid);
            const surveys = res2.reduce((acc, cur) => {
                if (!acc[cur.id]) {
                    acc[cur.id] = { ...cur, answers: [] };
                }
                if (cur.answers) {
                    acc[cur.id].answers.push(cur.answers);
                }
                return acc;
            }, {});
            return Object.values(surveys);
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
        // uidからidを取得する
        const userCheckStmt = db_for_app5.prepare('SELECT id FROM users WHERE uid = ?');
        const user = userCheckStmt.get(hashedUid);
        const id = user.id || null;

        const result_1 = readAllSurveysAndResponses();
        const result_2 = readMySurveysAndResponses(hashedUid);
        const result_3 = readMyResponses(hashedUid);
        // console.log(result_1);
        // console.log(result_2);
        // console.log(result_3);
        res.status(200).json({ id: id ,surveys: result_1, mySurveysAndResponses: result_2, myResponses: result_3 });
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


if (!Array.isArray(questions)) return res.status(400).json({ error: 'Invalid questions. It must be an array.' });
if (questions.length === 0) return res.status(400).json({ error: 'Invalid questions. It must contain at least one question.' });
if (questions.some(q => typeof q !== 'string')) return res.status(400).json({ error: 'Invalid questions. All questions must be strings.' });
if (questions.some(q => q.length < 1)) return res.status(400).json({ error: 'Invalid questions. Each question must contain at least one character.' });
if (questions.some(q => q.length > 1000)) return res.status(400).json({ error: 'Invalid questions. Each question must not exceed 1000 characters.' });
    

const hashedUid = hashUid(uid);

// ユーザーが存在するか確認
const userCheckStmt = db_for_app5.prepare('SELECT id FROM users WHERE uid = ?');
let user = userCheckStmt.get(hashedUid);

if (!user) {
    // ユーザーが存在しない場合、追加
    const addUserStmt = db_for_app5.prepare('INSERT INTO users (uid) VALUES (?)');
    const addUserResult = addUserStmt.run(hashedUid);
    user = { id: addUserResult.lastInsertRowid };
}

// surveysテーブルに追加
const surveyStmt = db_for_app5.prepare('INSERT INTO surveys (user_id, title, description, price, questions) VALUES (?, ?, ?, ?, ?)');
const surveyResult = surveyStmt.run(user.id, survey_title, survey_description || null, survey_price, JSON.stringify(questions));


    res.status(201).json({ message: 'Survey created successfully.', survey_id: surveyResult.lastInsertRowid });
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

    // 自分の作ったsurveyに対する回答は不可のため、uidとsurvey_idからuser_idを取得し、user_idが一致するか確認
    // user_idが一致する場合はエラーを返す
    const idCheckStmt = db_for_app5.prepare(`
        SELECT COUNT(*) AS count 
        FROM surveys 
        WHERE id = ? AND user_id = (SELECT id FROM users WHERE uid = ?)
    `);
    const id_check = idCheckStmt.get(survey_id, hashedUid).count > 0;
    if (id_check) {
        // 自分の作ったsurveyに対する回答は不可と表示するために、エラーを返す
        return res.status(404).json({ error: 'you can not answer to the survey you created.' });
    }

    const stmt = db_for_app5.prepare('INSERT INTO responses (survey_id, respondent_uid, answers) VALUES (?, ?, ?)');
    stmt.run(survey_id, hashedUid, JSON.stringify(answers));

    res.status(201).json({ message: 'Response created successfully.' });
});

 -->