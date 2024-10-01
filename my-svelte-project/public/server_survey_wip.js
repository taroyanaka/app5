// app5 => app5に変更

const db_for_app5 = new sqlite('app5.db');

const initializeDatabase_app5 = () => {
//     -- ユーザー情報を格納するテーブル
// CREATE TABLE users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     uid TEXT NOT NULL UNIQUE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- アンケート情報を格納するテーブル
// CREATE TABLE surveys (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     title TEXT NOT NULL,
//     description TEXT,
//     price REAL DEFAULT 100,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );

// -- 質問情報を格納するテーブル
// CREATE TABLE questions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     survey_id INTEGER NOT NULL,
//     question_text TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (survey_id) REFERENCES surveys(id)
// );

// -- 回答情報を格納するテーブル
// CREATE TABLE responses (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     survey_id INTEGER NOT NULL,
//     question_id INTEGER NOT NULL,
//     respondent_uid TEXT NOT NULL,
//     answer_text TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (survey_id) REFERENCES surveys(id),
//     FOREIGN KEY (question_id) REFERENCES questions(id),
//     FOREIGN KEY (respondent_uid) REFERENCES users(uid)
// );
db_for_app5.exec(`
    DROP TABLE IF EXISTS responses;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS surveys;
    DROP TABLE IF EXISTS users;
    `);

db_for_app5.exec(`
        CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,れあ
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        price REAL DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        survey_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id)
    );

    CREATE TABLE responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        survey_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        respondent_uid TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id),
        FOREIGN KEY (question_id) REFERENCES questions(id),
        FOREIGN KEY (respondent_uid) REFERENCES users(uid)
    );
`);


};
// initializeDatabase_app5();

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

app.post('/app5/create', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    // questions, surveys, users
    // survey_title TEXT NOT NULL, => 1文字以上100文字以下
    // survey_description TEXT, => 0文字以上1000文字以下
    // survey_price REAL DEFAULT 100, => 100以上で100毎に増加,小数点なし、最大10000
    // question_text TEXT NOT NULL, => 1文字以上1000文字以下
    const { uid, survey_title, survey_description, survey_price, question_text } = req.body;


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

    if (typeof question_text !== 'string' || question_text.length < 1 || question_text.length > 1000) {
        return res.status(400).json({ error: 'Invalid question_text. It must be a string between 1 and 1000 characters.' });
    }

    const hashedUid = hashUid(uid);

    const stmt = db_for_app5.prepare('INSERT INTO app5 (uid, app5_title, app5_text) VALUES (?, ?, ?)');
    const result = stmt.run(hashedUid, app5_title, app5_text || null);

    return res.status(201).json({
        id: result.lastInsertRowid,
        uid: hashedUid,
        app5_title,
        app5_text,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    });
});

app.post('/app5/read', (req, res) => {
    const hashUid = (uid) => {
        return crypto.createHash('sha256').update(uid).digest('hex');
    };

    const { uid } = req.body;

    try {
        // 全てのレコードを接続して取得
// questions, surveys, users, responses
const users = db_for_app5.prepare('SELECT * FROM users').all();
const surveys = db_for_app5.prepare('SELECT * FROM surveys').all();
const questions = db_for_app5.prepare('SELECT * FROM questions').all();
// 全てのusersとそれに紐づくsurveysを取得、さらにそれに紐づくquestionsを取得
const all_json = users.map(user => {
    const userSurveys = surveys.filter(survey => survey.user_id === user.id);
    const userSurveysWithQuestions = userSurveys.map(survey => {
        const surveyQuestions = questions.filter(question => question.survey_id === survey.id);
        return {
            ...survey,
            questions: surveyQuestions
        };
    });
    return {
        ...user,
        surveys: userSurveysWithQuestions
    };
});

        if (uid) {
            const hashedUid = hashUid(uid);
            // all_jsonからuidに一致するユーザーを取得
            const uid_json = all_json.find(user => user.uid === hashedUid);
            res.status(200).json({ uid_json, all_json });
        } else {
            res.status(200).json({ all_json });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve records.' });
    }
});

// 作成したアンケートは作成後に変更できないため、updateは実装しない

app.post('/app5/delete', (req, res) => {
    try {
        const hashUid = (uid) => {
            return crypto.createHash('sha256').update(uid).digest('hex');
        };
    
        const { id, uid } = req.body;
    
        if (typeof id !== 'number' || typeof uid !== 'string') {
            return res.status(400).json({ error: 'Invalid input.' });
        }
        
        // idがsurvey_idに一致するsurveyを削除、さらにそれに紐づくquestionも削除、さらにそれに紐づくresponseも削除
        const hashedUid = hashUid(uid);
        // uidがsurveyのuser_idに一致するか確認
        const stmt_check = db_for_app5.prepare('SELECT * FROM surveys WHERE id = ? AND user_id = (SELECT id FROM users WHERE uid = ?)');
        const result_check = stmt_check.get(id, hashedUid);
        // 一致しない場合はエラーをスロー
        result_check === undefined ? (()=>{throw new Error('Record not found or UID mismatch.')})() : null;
    
        // questions, surveys, users, responses
        // responses削除
        const stmt_responses = db_for_app5.prepare('DELETE FROM responses WHERE survey_id = ?');
        const result_responses = stmt_responses.run(id);
        // questions削除
        const stmt_questions = db_for_app5.prepare('DELETE FROM questions WHERE survey_id = ?');
        const result_questions = stmt_questions.run(id);
        // surveys削除
        const stmt_surveys = db_for_app5.prepare('DELETE FROM surveys WHERE id = ? AND user_id = (SELECT id FROM users WHERE uid = ?)');
        const result_surveys = stmt_surveys.run(id, hashedUid);

        if (result.changes > 0) {
            res.status(200).json({ message: 'Record deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Record not found or UID mismatch.' });
        }
    } catch (error) {
        
    }

});



// responsesに回答を追加するエンドポイント
app.post('/app5/respond', (req, res) => {
    const { survey_id, question_id, respondent_uid, answer_text } = req.body;

    if (typeof survey_id !== 'number' || typeof question_id !== 'number' || typeof respondent_uid !== 'string' || typeof answer_text !== 'string') {
        return res.status(400).json({ error: 'Invalid input.' });
    }
    // answer_textが1文字以上1000文字以下であるか確認
    if (answer_text.length < 1 || answer_text.length > 1000) {
        return res.status(400).json({ error: 'Invalid answer_text. It must be a string between 1 and 1000 characters.' });
    }

    // survey_idとquestion_idが存在するか確認
    const stmt_check = db_for_app5.prepare('SELECT * FROM surveys WHERE id = ?');
    const result_check = stmt_check.get(survey_id);
    result_check === undefined ? (()=>{throw new Error('Survey not found.')})() : null;
    const stmt_check2 = db_for_app5.prepare('SELECT * FROM questions WHERE id = ?');
    const result_check2 = stmt_check2.get(question_id);
    result_check2 === undefined ? (()=>{throw new Error('Question not found.')})() : null;

    const hashedUid = crypto.createHash('sha256').update(respondent_uid).digest('hex');

    try {
        const stmt = db_for_app5.prepare('INSERT INTO responses (survey_id, question_id, respondent_uid, answer_text) VALUES (?, ?, ?, ?)');
        const result = stmt.run(survey_id, question_id, hashedUid, answer_text);

        res.status(201).json({
            id: result.lastInsertRowid,
            survey_id,
            question_id,
            respondent_uid: hashedUid,
            answer_text,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit response.' });
    }
});

// responderが回答したrespondを取得するエンドポイント(uidが指定されたrespondのみ取得)
app.post('/app5/responder_responses', (req, res) => {
    const { uid } = req.body;

    if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
        return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');

    try {
        const responses = db_for_app5.prepare('SELECT * FROM responses WHERE respondent_uid = ?').all(hashedUid);

        if (responses.length === 0) {
            return res.status(404).json({ error: 'No responses found for the given uid.' });
        }

        res.status(200).json({ responses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve responses.' });
    }
});

// surveyに紐づく全てのrespondをsurvery作成者が取得するエンドポイント(survey_idが指定せず、uidが指定されたrespondを全て取得)
app.post('/app5/survey_responses', (req, res) => {
try {
    const { uid } = req.body;

    if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
        return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');

        const surveys = db_for_app5.prepare('SELECT id FROM surveys WHERE user_id = (SELECT id FROM users WHERE uid = ?)').all(hashedUid);

        if (surveys.length === 0) {
            return res.status(404).json({ error: 'No surveys found for the given uid.' });
        }

        const surveyIds = surveys.map(survey => survey.id);
        const responses = db_for_app5.prepare(`SELECT * FROM responses WHERE survey_id IN (${surveyIds.join(',')})`).all();

        res.status(200).json({ responses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve responses.' });
    }
});
