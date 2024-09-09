{
    /////////////////////////////server_express.js/////////////////////////////
    /////////////////////////////server_express.js/////////////////////////////
    /////////////////////////////server_express.js/////////////////////////////
    
    /////////////////////////////AI/////////////////////////////
    // 以下のコードを以下のルールで書き換えて
    // pop_up_url => app5
    // app5_title => app5_title TEXT not nullで1文字以上100文字以下
    // url_list => app5_text TEXT nullで1文字以上1000文字以下
    /////////////////////////////AI/////////////////////////////
        
    // const crypto = require('crypto');
    
    // const db_for_app5 = new sqlite('app5.db');
    
    // const initializeDatabase_app5 = () => {
    //     db_for_app5.exec('DROP TABLE IF EXISTS app5');
    //     db_for_app5.exec(`
    //         CREATE TABLE app5 (
    //             id INTEGER PRIMARY KEY AUTOINCREMENT,
    //             uid TEXT NOT NULL CHECK(length(uid) = 64), -- SHA-256 produces a 64-character hex string
    //             app5_title TEXT NOT NULL CHECK(length(app5_title) >= 1 AND length(app5_title) <= 100),
    //             app5_text TEXT NULL CHECK(length(app5_text) >= 1 AND length(app5_text) <= 1000),
    //             created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //             updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //         );
    //     `);
    // };
    // initializeDatabase_app5();
    
    // app.post('/app5/init-database', (req, res) => {
    //     const { password } = req.body;
    
    //     if (password === 'init') {
    //         try {
    //             initializeDatabase_app5();
    //             res.status(200).json({ message: 'Database initialized successfully.' });
    //         } catch (error) {
    //             res.status(500).json({ error: 'Failed to initialize database.' });
    //         }
    //     } else {
    //         res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    //     }
    // });
    
    // app.post('/app5/create', (req, res) => {
    //     const hashUid = (uid) => {
    //         return crypto.createHash('sha256').update(uid).digest('hex');
    //     };
    
    //     const { uid, app5_title, app5_text } = req.body;
    
    //     if (typeof uid !== 'string' || uid.length < 1 || uid.length > 50) {
    //         return res.status(400).json({ error: 'Invalid uid. It must be a string between 1 and 50 characters.' });
    //     }
    
    //     if (typeof app5_title !== 'string' || app5_title.length < 1 || app5_title.length > 100) {
    //         return res.status(400).json({ error: 'Invalid app5_title. It must be a string between 1 and 100 characters.' });
    //     }
    
    //     if (app5_text && (typeof app5_text !== 'string' || app5_text.length < 1 || app5_text.length > 1000)) {
    //         return res.status(400).json({ error: 'Invalid app5_text. It must be a string between 1 and 1000 characters.' });
    //     }
    
    //     const hashedUid = hashUid(uid);
    
    //     const stmt = db_for_app5.prepare('INSERT INTO app5 (uid, app5_title, app5_text) VALUES (?, ?, ?)');
    //     const result = stmt.run(hashedUid, app5_title, app5_text || null);
    
    //     return res.status(201).json({
    //         id: result.lastInsertRowid,
    //         uid: hashedUid,
    //         app5_title,
    //         app5_text,
    //         created: new Date().toISOString(),
    //         updated: new Date().toISOString()
    //     });
    // });
    
    // app.post('/app5/read', (req, res) => {
    //     const hashUid = (uid) => {
    //         return crypto.createHash('sha256').update(uid).digest('hex');
    //     };
    
    //     const { uid } = req.body;
    
    //     try {
    //         const stmt_all = db_for_app5.prepare('SELECT * FROM app5');
    //         const all_json = stmt_all.all();
    
    //         if (uid) {
    //             const hashedUid = hashUid(uid);
    //             const stmt_uid = db_for_app5.prepare('SELECT * FROM app5 WHERE uid = ?');
    //             const uid_json = stmt_uid.all(hashedUid);
    //             res.status(200).json({ uid_json, all_json });
    //         } else {
    //             res.status(200).json({ all_json });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ error: 'Failed to retrieve records.' });
    //     }
    // });
    
    // app.post('/app5/update', (req, res) => {
    //     const hashUid = (uid) => {
    //         return crypto.createHash('sha256').update(uid).digest('hex');
    //     };
    
    //     const { id, uid, app5_title, app5_text } = req.body;
    
    //     if (typeof id !== 'number' || typeof uid !== 'string' || uid.length < 1 || uid.length > 50 ||
    //         typeof app5_title !== 'string' || app5_title.length < 1 || app5_title.length > 100 ||
    //         (app5_text && (typeof app5_text !== 'string' || app5_text.length < 1 || app5_text.length > 1000))) {
    //         return res.status(400).json({ error: 'Invalid input.' });
    //     }
    
    //     const hashedUid = hashUid(uid);
    
    //     const stmt = db_for_app5.prepare('UPDATE app5 SET app5_title = ?, app5_text = ?, updated = CURRENT_TIMESTAMP WHERE id = ? AND uid = ?');
    //     const result = stmt.run(app5_title, app5_text || null, id, hashedUid);
    
    //     if (result.changes > 0) {
    //         res.status(200).json({ message: 'Record updated successfully.' });
    //     } else {
    //         res.status(404).json({ error: 'Record not found or UID mismatch.' });
    //     }
    // });
    
    // app.post('/app5/delete', (req, res) => {
    //     const hashUid = (uid) => {
    //         return crypto.createHash('sha256').update(uid).digest('hex');
    //     };
    
    //     const { id, uid } = req.body;
    
    //     if (typeof id !== 'number' || typeof uid !== 'string') {
    //         return res.status(400).json({ error: 'Invalid input.' });
    //     }
    
    //     const hashedUid = hashUid(uid);
    
    //     const stmt = db_for_app5.prepare('DELETE FROM app5 WHERE id = ? AND uid = ?');
    //     const result = stmt.run(id, hashedUid);
    
    //     if (result.changes > 0) {
    //         res.status(200).json({ message: 'Record deleted successfully.' });
    //     } else {
    //         res.status(404).json({ error: 'Record not found or UID mismatch.' });
    //     }
    // });
        
        
        /////////////////////////////server_express.js/////////////////////////////
        /////////////////////////////server_express.js/////////////////////////////
        /////////////////////////////server_express.js/////////////////////////////
        };
        
        
        
        /////////////////////////////server/////////////////////////////
        /////////////////////////////server/////////////////////////////
        /////////////////////////////server/////////////////////////////
    
    
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    // 以下をapp5用に書き換えて
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    /////////////////////////////server/////////////////////////////
    