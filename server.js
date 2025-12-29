const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_database'
});

connection.connect();

// 검색 API
app.get('/api/cards', (req, res) => {
    const { region1, region2, specialists, others } = req.query;

    let query = 'SELECT * FROM hospitals WHERE 1=1';
    if (region1) query += ` AND region1 = '${region1}'`;
    if (region2) query += ` AND region2 = '${region2}'`;
    if (specialists) query += ` AND specialists IN (${specialists.split(',').map(s => `'${s}'`).join(',')})`;
    if (others) query += ` AND others IN (${others.split(',').map(o => `'${o}'`).join(',')})`;

    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json(results);
    });
});

// 카드 상세 API
app.get('/api/cards/:cardId', (req, res) => {
    const { cardId } = req.params;

    // 쿼리 생성 (좌표 정보 포함)
    const query = 'SELECT * FROM hospitals WHERE id = ?';
    connection.query(query, [cardId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        
        if (results.length > 0) {
            const hospital = results[0];
            // 응답에 좌표 정보 포함
            res.json({
                id: hospital.id,
                name: hospital.name,
                address: hospital.address,
                phone: hospital.phone,
                latitude: hospital.latitude, // 좌표 정보
                longitude: hospital.longitude, // 좌표 정보
                // 기타 필요한 정보
            });
        } else {
            res.status(404).json({ error: 'Hospital not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});