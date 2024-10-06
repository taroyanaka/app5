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
});