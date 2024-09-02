const db = new sqlite('survey.db');

const initializeDatabase = () => {
    db.exec('DROP TABLE IF EXISTS responses');
    db.exec('DROP TABLE IF EXISTS questions');
    db.exec('DROP TABLE IF EXISTS surveys');
    db.exec('DROP TABLE IF EXISTS users');

    db.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT NOT NULL UNIQUE CHECK(length(uid) = 64),
            role TEXT NOT NULL CHECK(role IN ('requester', 'respondent', 'admin'))
        );
    `);

    db.exec(`
        CREATE TABLE surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL CHECK(length(title) >= 1 AND length(title) <= 100),
            description TEXT,
            price REAL NOT NULL,
            requester_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requester_id) REFERENCES users(id)
        );
    `);

    db.exec(`
        CREATE TABLE questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id INTEGER NOT NULL,
            question_text TEXT NOT NULL CHECK(length(question_text) >= 1 AND length(question_text) <= 255),
            FOREIGN KEY (survey_id) REFERENCES surveys(id)
        );
    `);

    db.exec(`
        CREATE TABLE responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            respondent_id INTEGER NOT NULL,
            response_value INTEGER NOT NULL CHECK(response_value BETWEEN 1 AND 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            FOREIGN KEY (respondent_id) REFERENCES users(id)
        );
    `);
};

app.post('/survey/init-database', (req, res) => { // エンドポイント: データベースの初期化
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

app.post('/survey/create', (req, res) => { // エンドポイント: アンケートの作成 (発注者向け)
    const { uid, title, description, price } = req.body;

    if (!uid || typeof title !== 'string' || title.length < 1 || title.length > 100) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT id FROM users WHERE uid = ? AND role = "requester"').get(hashedUid);

    if (!requester) {
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID.' });
    }

    const stmt = db.prepare('INSERT INTO surveys (title, description, price, requester_id) VALUES (?, ?, ?, ?)');
    const result = stmt.run(title, description || null, price, requester.id);

    return res.status(201).json({
        id: result.lastInsertRowid,
        title,
        description,
        price,
        created_at: new Date().toISOString()
    });
});

app.post('/survey/:surveyId/add-question', (req, res) => { // エンドポイント: 質問の追加 (発注者向け)
    const { uid, question_text } = req.body;
    const { surveyId } = req.params;

    if (!uid || typeof question_text !== 'string' || question_text.length < 1 || question_text.length > 255) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = "requester"').get(hashedUid, surveyId);

    if (!requester) {
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID or survey not found.' });
    }

    const stmt = db.prepare('INSERT INTO questions (survey_id, question_text) VALUES (?, ?)');
    const result = stmt.run(surveyId, question_text);

    return res.status(201).json({
        id: result.lastInsertRowid,
        survey_id: surveyId,
        question_text
    });
});

app.post('/survey/read', (req, res) => { // エンドポイント: アンケートとその質問の読み取り (回答者向け)
    const { uid } = req.body;

    try {
        const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
        const user = db.prepare('SELECT id FROM users WHERE uid = ?').get(hashedUid);

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

app.post('/survey/:questionId/respond', (req, res) => { // エンドポイント: 質問への回答 (回答者向け)
    const { uid, response_value } = req.body;
    const { questionId } = req.params;

    if (!uid || typeof response_value !== 'number' || response_value < 1 || response_value > 5) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const respondent = db.prepare('SELECT id FROM users WHERE uid = ? AND role = "respondent"').get(hashedUid);

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

app.post('/survey/update', (req, res) => { // エンドポイント: アンケートの更新 (発注者向け)
    const { uid, survey_id, title, description, price } = req.body;

    if (!uid || !survey_id || typeof title !== 'string' || title.length < 1 || title.length > 100) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = "requester"').get(hashedUid, survey_id);

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

app.post('/survey/delete', (req, res) => { // エンドポイント: アンケートの削除 (発注者向け)
    const { uid, survey_id } = req.body;

    if (!uid || !survey_id) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const requester = db.prepare('SELECT s.id FROM surveys s JOIN users u ON s.requester_id = u.id WHERE u.uid = ? AND s.id = ? AND u.role = "requester"').get(hashedUid, survey_id);

    if (!requester) {
        return res.status(403).json({ error: 'Unauthorized: Invalid requester UID or survey not found.' });
    }

    const stmt = db.prepare('DELETE FROM surveys WHERE id = ? AND requester_id = ?');
    const result = stmt.run(survey_id, requester.id);

    if (result.changes > 0) {
        res.status(200).json({ message: 'Survey deleted successfully.' });
    } else {
        res.status(404).json({ error: 'Survey not found or UID mismatch.' });
    }
});

app.post('/survey/responses', (req, res) => { // エンドポイント: 全ての回答の取得 (管理者向け)
    const { uid } = req.body;

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const admin = db.prepare('SELECT id FROM users WHERE uid = ? AND role = "admin"').get(hashedUid);

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

    return res.status(200).json({ responses });
});

app.post('/survey/register', (req, res) => { // エンドポイント: ユーザーの登録
    const { uid, role } = req.body;

    if (!uid || !['requester', 'respondent', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    const hashedUid = crypto.createHash('sha256').update(uid).digest('hex');
    const existingUser = db.prepare('SELECT id FROM users WHERE uid = ?').get(hashedUid);

    if (existingUser) {
        return res.status(409).json({ error: 'User already exists.' });
    }

    const stmt = db.prepare('INSERT INTO users (uid, role) VALUES (?, ?)');
    const result = stmt.run(hashedUid, role);

    return res.status(201).json({
        id: result.lastInsertRowid,
        uid: hashedUid,
        role
    });
});
