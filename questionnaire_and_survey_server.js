const hashing = false;

const express = require('express');
const sqlite = require('better-sqlite3');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`App listening at http://localhost:${port}`);
});

const db = new sqlite('survey.db');

const initializeDatabase = () => {
    db.exec(`
-- 既存のテーブルを削除
DROP TABLE IF EXISTS survey_access;
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS users;

-- 1. users テーブルを作成
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE, -- ユーザー識別子（ユニーク）
    role TEXT NOT NULL CHECK(role IN ('requester', 'respondent', 'admin')) -- ユーザーの種類を指定
);

-- 2. surveys テーブルを作成
CREATE TABLE surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, -- アンケートの題名
    description TEXT, -- アンケートの説明
    price REAL NOT NULL, -- アンケート実施にかかる価格
    requester_id INTEGER NOT NULL, -- 発注者
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) -- 発注者とのリレーション
);

-- 3. questions テーブルを作成
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL, -- 所属するアンケート
    question_text TEXT NOT NULL, -- 質問内容
    FOREIGN KEY (survey_id) REFERENCES surveys(id) -- アンケートとのリレーション
);

-- 4. responses テーブルを作成
CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL, -- 回答する質問
    respondent_id INTEGER NOT NULL, -- 回答者
    response_value INTEGER NOT NULL CHECK(response_value BETWEEN 1 AND 5), -- 回答（1から5の範囲）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id), -- 質問とのリレーション
    FOREIGN KEY (respondent_id) REFERENCES users(id) -- 回答者とのリレーション
);

-- 5. survey_access テーブルを作成
CREATE TABLE survey_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL, -- アンケートのまとまり
    user_id INTEGER NOT NULL, -- 閲覧権限を持つユーザー
    FOREIGN KEY (survey_id) REFERENCES surveys(id), -- アンケートとのリレーション
    FOREIGN KEY (user_id) REFERENCES users(id) -- ユーザーとのリレーション
);

-- サンプルデータの挿入
-- 1. users テーブルにサンプルデータを挿入
INSERT INTO users (uid, role) VALUES ('user1_uid', 'requester');
INSERT INTO users (uid, role) VALUES ('user2_uid', 'respondent');
INSERT INTO users (uid, role) VALUES ('user3_uid', 'admin');
INSERT INTO users (uid, role) VALUES ('user4_uid', 'respondent');

-- 2. surveys テーブルにサンプルデータを挿入
INSERT INTO surveys (title, description, price, requester_id) VALUES ('Customer Satisfaction Survey', 'A survey to measure customer satisfaction.', 100.00, 1);
INSERT INTO surveys (title, description, price, requester_id) VALUES ('Employee Engagement Survey', 'A survey to gauge employee engagement.', 200.00, 1);

-- 3. questions テーブルにサンプルデータを挿入
INSERT INTO questions (survey_id, question_text) VALUES (1, 'How satisfied are you with our service?');
INSERT INTO questions (survey_id, question_text) VALUES (1, 'How likely are you to recommend us to a friend?');
INSERT INTO questions (survey_id, question_text) VALUES (2, 'How engaged do you feel at work?');
INSERT INTO questions (survey_id, question_text) VALUES (2, 'How satisfied are you with your current role?');

-- 4. responses テーブルにサンプルデータを挿入
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (1, 2, 4); -- user2が質問1に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (2, 2, 5); -- user2が質問2に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (3, 4, 3); -- user4が質問3に回答
INSERT INTO responses (question_id, respondent_id, response_value) VALUES (4, 4, 2); -- user4が質問4に回答

-- 5. survey_access テーブルにサンプルデータを挿入
INSERT INTO survey_access (survey_id, user_id) VALUES (1, 1); -- user1がアンケート1にアクセス可能
INSERT INTO survey_access (survey_id, user_id) VALUES (1, 3); -- user3がアンケート1にアクセス可能（管理者）
INSERT INTO survey_access (survey_id, user_id) VALUES (2, 1); -- user1がアンケート2にアクセス可能
INSERT INTO survey_access (survey_id, user_id) VALUES (2, 3); -- user3がアンケート2にアクセス可能（管理者）
    `);
};



app.post('/survey/init-database', (req, res) => {
    const { password } = req.body;

    if (password === 'init') {
        try {
            initializeDatabase();
            res.status(200).json({ message: 'Database initialized successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize database.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});


app.post('/survey/create', (req, res) => {
    const { uid, title, description, price, validQuestions } = req.body;
    if (!uid || typeof title !== 'string' || title.length < 1 || title.length > 100
        || validQuestions.length === 0 || validQuestions.some(question => !question.text || question.text.length === 0 || !question.selectedAnswer
            //  || question.selectedAnswer < 1 || question.selectedAnswer > 5
            )
    ) {
        console.log({uid, title, description, price, validQuestions});
        // エラーごとにconsole.logを追加
        if(!uid) console.log('uid is missing');
        if(typeof title !== 'string') console.log('title is not a string');
        if(title.length <= 1) console.log('title is too short');
        if(title.length > 100) console.log('title is too long');
        if(validQuestions.length === 0) console.log('validQuestions is empty');
        if(validQuestions.some(question => !question.text)) console.log('question.text is missing');
        if(validQuestions.some(question => question.text.length === 0)) console.log('question.text is empty');
        if(validQuestions.some(question => !question.selectedAnswer)) console.log('selectedAnswer is missing');
        // selectedAnswerは全て3


        // if(validQuestions.some(question => question.selectedAnswer < 1)) console.log('selectedAnswer is too small');
        // if(validQuestions.some(question => question.selectedAnswer > 5)) console.log('selectedAnswer is too large');


      

        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT id FROM users WHERE uid = ? AND role = ?').get(hashing === true ?hashedUid:uid, 'requester');

    if (!requester) {
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID.' });
    }

    const stmt = db.prepare('INSERT INTO surveys (title, description, price, requester_id) VALUES (?, ?, ?, ?)');
    const result = stmt.run(title, description || null, price, requester.id);
    // questionsをvalidQuestionsから取得して、それをquestionsテーブルにinsertする
    const surveyId = result.lastInsertRowid;
    validQuestions.forEach(question => {
        // selectedAnswerは全て3
        question.selectedAnswer = 3;
        const stmt2 = db.prepare('INSERT INTO questions (survey_id, question_text) VALUES (?, ?)');
        stmt2.run(surveyId, question.text);
    });

    return res.status(201).json({
        id: result.lastInsertRowid,
        title,
        description,
        price,
        created_at: new Date().toISOString()
    });
});

// add-questionは不要
// app.post('/survey/:surveyId/add-question', (req, res) => {
//     const { uid, question_text } = req.body;
//     const { surveyId } = req.params;

//     if (!uid || typeof question_text !== 'string' || question_text.length < 1 || question_text.length > 255) {
//         return res.status(400).json({ error: 'Invalid input.' });
//     }

//     const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
//     const requester = db.prepare('SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = ?').get(hashing === true ?hashedUid:uid, surveyId, 'requester');

//     if (!requester) {
//         return res.status(403).json({ error: 'Unauthorized: Invalid requester UID or survey not found.' });
//     }

//     const stmt = db.prepare('INSERT INTO questions (survey_id, question_text) VALUES (?, ?)');
//     const result = stmt.run(surveyId, question_text);

//     return res.status(201).json({
//         id: result.lastInsertRowid,
//         survey_id: surveyId,
//         question_text
//     });
// });

app.post('/survey/read', (req, res) => {
    const { uid } = req.body;

    try {
        const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
        const user = db.prepare('SELECT id FROM users WHERE uid = ?').get(hashing === true ?hashedUid:uid);

        if (!user) {
            return res.status(403).json({ error: 'Unauthorized: Invalid UID.' });
        }

        const surveys = db.prepare(`
            SELECT s.id AS survey_id, s.title, s.description, s.price, s.created_at,
                   q.id AS question_id, q.question_text
            FROM surveys s
            JOIN questions q ON s.id = q.survey_id
        `).all();

        res.status(200).json({ surveys });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve surveys.' });
    }
});
// 特定のuidのアンケートだけをreadするエンドポイントを作って
app.post('/survey/read-by-requester', (req, res) => {
    const { uid } = req.body;

    try {
        const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
        const user = db.prepare('SELECT id FROM users WHERE uid = ?').get(hashing === true ?hashedUid:uid);

        if (!user) {
            return res.status(403).json({ error: 'Unauthorized: Invalid UID.' });
        }

        const surveys = db.prepare(`
            SELECT s.id AS survey_id, s.title, s.description, s.price, s.created_at,
                   q.id AS question_id, q.question_text
            FROM surveys s
            JOIN questions q ON s.id = q.survey_id
            WHERE s.requester_id = ?
        `).all(user.id);
        
        // 複数のquestionを抱えるsurveysを、resするsql
        const surveyQuestions = surveys.reduce((acc, survey) => {
            const existingSurvey = acc.find(item => item.survey_id === survey.survey_id);
            if (existingSurvey) {
                existingSurvey.questions.push({
                    question_id: survey.question_id,
                    question_text: survey.question_text
                });
            } else {
                acc.push({
                    survey_id: survey.survey_id,
                    title: survey.title,
                    description: survey.description,
                    price: survey.price,
                    created_at: survey.created_at,
                    questions: [{
                        question_id: survey.question_id,
                        question_text: survey.question_text
                    }]
                });
            }
            return acc;
        }, []);

        res.status(200).json({ surveys: surveyQuestions });
        // res.status(200).json({ surveys });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve surveys.' });
    }
});



app.post('/survey/:questionId/respond', (req, res) => {
    const { uid, response_value } = req.body;
    const { questionId } = req.params;

    if (!uid || typeof response_value !== 'number' || response_value < 1 || response_value > 5) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const respondent = db.prepare('SELECT id FROM users WHERE uid = ? AND role = ?').get(hashing === true ?hashedUid:uid, 'respondent');

    if (!respondent) {
        return res.status(403).json({ error: 'Unauthorized: Invalid respondent UID.' });
    }

    const stmt = db.prepare('INSERT INTO responses (question_id, respondent_id, response_value) VALUES (?, ?, ?)');
    const result = stmt.run(questionId, respondent.id, response_value);

    return res.status(201).json({
        id: result.lastInsertRowid,
        question_id: questionId,
        respondent_id: respondent.id,
        response_value,
        created_at: new Date().toISOString()
    });
});

app.post('/survey/update', (req, res) => {
    const { uid, survey_id, title, description, price } = req.body;

    if (!uid || !survey_id || typeof title !== 'string' || title.length < 1 || title.length > 100) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = ?').get(hashing === true ?hashedUid:uid, survey_id, 'requester');

    if (!requester) {
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID or survey not found.' });
    }

    const stmt = db.prepare('UPDATE surveys SET title = ?, description = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND requester_id = ?');
    const result = stmt.run(title, description || null, price, survey_id, requester.id);

    if (result.changes > 0) {
        res.status(200).json({ message: 'Survey updated successfully.' });
    } else {
        res.status(404).json({ error: 'Survey not found or UID mismatch.' });
    }
});

app.post('/survey/delete', (req, res) => {
    const { uid, survey_id } = req.body;

    // Debugging: Log the incoming request data
    console.log('Request body:', req.body);

    if (!uid || !survey_id) {
        console.log('Invalid input: missing uid or survey_id');
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');

    // Debugging: Log the hashed UID
    console.log('Hashed UID:', hashedUid);

    // Query to check if the requester is authorized
    const requester = db.prepare(
        'SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = ?'
    ).get(hashedUid, survey_id, 'requester');

    // Debugging: Log the result of the authorization query
    console.log('Requester query result:', requester);

    if (!requester) {
        console.log('Unauthorized: Invalid requester UID or survey not found.');
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID or survey not found.' });
    }

    // Delete the survey
    const stmt = db.prepare('DELETE FROM surveys WHERE id = ? AND requester_id = ?');
    const result = stmt.run(survey_id, requester.id);

    // Debugging: Log the result of the deletion operation
    console.log('Delete operation result:', result);

    if (result.changes > 0) {
        console.log('Survey deleted successfully.');
        res.status(200).json({ message: 'Survey deleted successfully.' });
    } else {
        console.log('Survey not found or UID mismatch.');
        res.status(404).json({ error: 'Survey not found or UID mismatch.' });
    }
});


app.post('/survey/responses', (req, res) => {
    const { uid } = req.body;
    console.log(uid);

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    console.log(hashedUid);
    const admin = db.prepare('SELECT id FROM users WHERE uid = ? AND role = ?').get(hashing === true ?hashedUid:uid, 'admin');
    console.log(hashing === true ?hashedUid:uid);
    console.log(admin);

    if (!admin) {
        return res.status(403).json({ error: 'Unauthorized: Invalid admin UID.' });
    }

    const responses = db.prepare(`
        SELECT r.id, r.question_id, r.respondent_id, r.response_value, r.created_at,
               q.question_text, s.title AS survey_title
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        JOIN surveys s ON q.survey_id = s.id
    `).all();

    console.log(responses);

    res.status(200).json({ responses });
});

app.post('/register', (req, res) => {
    const { uid, role } = req.body;

    if (!uid || !role || !['requester', 'respondent', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');

    try {
        const stmt = db.prepare('INSERT INTO users (uid, role) VALUES (?, ?)');
        stmt.run(hashing === true ?hashedUid:uid, role);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({ error: 'User already registered.' });
        } else {
            res.status(500).json({ error: 'Failed to register user.' });
        }
    }
});
